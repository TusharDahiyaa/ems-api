import express from "express";
import { Request, Response } from "express";
import { EmployeeZodSchema } from "../validations/zodMain";
import authMiddleware from "../middleware/auth";
import prisma from "../client";
// import jwt from "jsonwebtoken";
require("dotenv").config();

const empRouter = express.Router();

empRouter.post(
  "/addEmployee",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to create employee
      if (!role["permissions"].includes("CREATE_EMPLOYEE")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const validationResult = EmployeeZodSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error });
      }

      const employeeData = validationResult.data;

      const findUser = await prisma.user.findUnique({
        where: { username: employeeData.username.toLowerCase() },
      });

      if (!findUser) {
        return res.status(400).json({
          error: "User not found. Create a user ID first.",
        });
      }

      const existingRole = await prisma.role.findUnique({
        where: { name: employeeData.roleName.toUpperCase() },
      });

      //Check existing Roles
      if (!existingRole) {
        await prisma.role.create({
          data: { name: employeeData.roleName.toUpperCase() },
        });
      }

      //Check existing department names
      const existingDepartment = await prisma.department.findUnique({
        where: { name: employeeData.departmentName.toUpperCase() },
      });

      if (!existingDepartment) {
        await prisma.department.create({
          data: { name: employeeData.departmentName.toUpperCase() },
        });
      }

      const newEmployee = await prisma.employee.create({
        data: {
          username: employeeData.username.toLowerCase(),
          address: employeeData.address,
          jobType: employeeData.jobType,
          departmentName: employeeData.departmentName.toUpperCase(),
          roleName: employeeData.roleName.toUpperCase(),
        },
      });

      res
        .status(201)
        .json({ message: "Employee created successfully", newEmployee });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while creating employee" });
    }
  }
);

empRouter.get(
  "/employeesByJobType",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role, jobType } = req.body;

      if (!role["permissions"].includes("READ_ALL_EMPLOYEES")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      if (!req.body.jobType) {
        return res
          .status(400)
          .json({ error: "Missing jobType in request body" });
      }

      if (
        jobType !== "FULL_TIME" &&
        jobType !== "PART_TIME" &&
        jobType !== "CONTRACT"
      ) {
        return res
          .status(400)
          .json({ error: "Invalid `jobType` property in request body" });
      }

      const employeesByJobType = await prisma.employee.findMany({
        where: {
          jobType: jobType,
        },
      });

      res.json({ employeesByJobType });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "An error occurred while getting employees by job type",
      });
    }
  }
);

empRouter.get(
  "/employeesByDepartment",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body;

      if (!role["permissions"].includes("READ_ALL_EMPLOYEES")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      if (!req.body.departmentName) {
        return res
          .status(400)
          .json({ error: "Missing Department Name in request body" });
      }

      const departmentName = req.body.departmentName.toUpperCase();

      const employeesByDepartment = await prisma.employee.findMany({
        where: { departmentName },
      });

      res.json({ employeesByDepartment });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "An error occurred while getting employees by Department",
      });
    }
  }
);

empRouter.get(
  "/employeeByUsername",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role, username } = req.body;

      if (!role["permissions"].includes("READ_ALL_EMPLOYEES")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      if (!req.body.username) {
        return res
          .status(400)
          .json({ error: "Missing username in request body" });
      }

      const employeeByUsername = await prisma.employee.findUnique({
        where: {
          username: username.toLowerCase(),
        },
      });

      if (!employeeByUsername) {
        return res.status(404).json({ error: "Employee not found" });
      }

      res.json({ employeeByUsername });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "An error occurred while getting the employee by username",
      });
    }
  }
);

module.exports = empRouter;

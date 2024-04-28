import express from "express";
import { Request, Response } from "express";
import { RoleZodSchema, UserZodSchema } from "../validations/zodMain";
import authMiddleware from "../middleware/auth";
import { Permission } from "../validations/permissionsValidate";
import prisma from "../client";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "No user found with this username!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const userName: string = user.username;

    const accessToken = jwt.sign(
      { userName },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "60min" }
    );
    res.json(`Bearer ${accessToken}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

userRouter.post("/logout", async (req: Request, res: Response) => {
  try {
    // Updated client credentials and removed JWT from cookie (implement if needed)
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while logging out" });
  }
});

userRouter.post(
  "/createUser",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to create user
      if (
        !role["permissions"].includes("CREATE_USER") &&
        !role.includes("ADMIN")
      ) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const validatedInput = UserZodSchema.safeParse(req.body);

      if (!validatedInput.success) {
        return res.status(400).json({ error: validatedInput.error });
      }

      const validatedData = validatedInput.data;

      const roleName = await prisma.role.findUnique({
        where: { name: validatedData?.roleName?.toUpperCase() },
      });

      if (!roleName) {
        await prisma.role.create({
          data: { name: validatedData?.roleName?.toUpperCase() || "" },
        });
      }

      const user = await prisma.user.create({
        data: {
          username: validatedData.username.toLowerCase(),
          password: await bcrypt.hash(validatedData.password, 10),
          firstName: validatedData.firstName || "",
          lastName: validatedData.lastName || "",
          email: validatedData.email || "",
          phoneNumber: validatedData.phoneNumber || "",
          dateOfBirth: validatedData.dateOfBirth || "",
          Role: {
            connect: { name: validatedData?.roleName?.toUpperCase() },
          },
        },
      });

      res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while creating user" });
    }
  }
);

userRouter.put(
  "/updateUser",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to create user
      if (!role["permissions"].includes("UPDATE_USER")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const validatedInput = UserZodSchema.safeParse(req.body);

      if (!validatedInput.success) {
        return res.status(400).json({ error: validatedInput.error });
      }

      const validatedData = validatedInput.data;

      const findUser = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (!findUser) {
        res.status(403).json({ error: "User not found" });
      }

      if (role["name"].includes("ADMIN")) {
        const user = await prisma.user.update({
          where: { username: validatedData.username },
          data: {
            username: validatedData.username || findUser?.username,
            password: validatedData.password
              ? await bcrypt.hash(validatedData.password, 10)
              : findUser?.password,
            firstName: validatedData.firstName || findUser?.firstName,
            lastName: validatedData.lastName || findUser?.lastName,
            phoneNumber: validatedData.phoneNumber || findUser?.phoneNumber,
            dateOfBirth: validatedData.dateOfBirth || findUser?.dateOfBirth,
            roleName: validatedData.roleName || findUser?.roleName,
          },
        });

        res.status(201).json({ message: "User updated successfully", user });
      } else {
        const user = await prisma.user.update({
          where: { username: validatedData.username },
          data: {
            firstName: validatedData.firstName || findUser?.firstName,
            lastName: validatedData.lastName || findUser?.lastName,
            phoneNumber: validatedData.phoneNumber || findUser?.phoneNumber,
            dateOfBirth: validatedData.dateOfBirth || findUser?.dateOfBirth,
          },
        });

        res.status(201).json({ message: "User updated successfully", user });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updated user" });
    }
  }
);

userRouter.put(
  "/updateRole",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role, roleName, permissions } = req.body; // Get roles from middleware

      // Check if user has permission to create user
      if (
        !role["permissions"].includes("UPDATE_ROLE") &&
        !role["name".toUpperCase()].includes("ADMIN")
      ) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const validatedInput = RoleZodSchema.safeParse({ roleName, permissions });

      if (!validatedInput.success) {
        return res.status(400).json({ error: validatedInput.error });
      }

      const validatedData = validatedInput.data;

      const findRole = await prisma.role.findUnique({
        where: {
          name: validatedData.roleName.toUpperCase(),
        },
      });

      if (!findRole) {
        res.status(403).json({ error: "Role not found" });
      }

      const permissionsEnum: Permission[] = validatedData.permissions.map(
        (permission) => Permission[permission as keyof typeof Permission]
      );

      const updateRole = await prisma.role.update({
        where: {
          name: validatedData.roleName.toUpperCase(),
        },
        data: {
          permissions: permissionsEnum,
        },
      });

      res
        .status(201)
        .json({ message: "Role updated successfully", updateRole });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while creating user" });
    }
  }
);

userRouter.delete(
  "/deleteUser/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to delete user
      if (!role["permissions"].includes("DELETE_USER")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const userId = parseInt(req.params.id);
      await prisma.user.delete({
        where: { id: userId },
      });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting user" });
    }
  }
);

userRouter.get(
  "/getAllUsers",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to get all users
      if (!role["permissions"].includes("READ_ALL_USERS")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const users = await prisma.user.findMany();

      res.json({ users });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while getting all users" });
    }
  }
);

userRouter.get(
  "/getAllRoles",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to get all roles
      if (!role["permissions"].includes("READ_ALL_ROLES")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const roles = await prisma.role.findMany();

      res.json({ roles });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while getting all roles" });
    }
  }
);

userRouter.get(
  "/getAllDepartments",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body; // Get roles from middleware

      // Check if user has permission to get all departments
      if (!role["permissions"].includes("READ_ALL_DEPARTMENTS")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      const departments = await prisma.department.findMany();

      res.json({ departments });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while getting all departments" });
    }
  }
);

userRouter.get(
  "/usersByRoleName",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body;

      if (!role["permissions"].includes("READ_ALL_USERS")) {
        return res
          .status(403)
          .json({ error: "Forbidden - Insufficient Permission" });
      }

      if (!req.body.roleName) {
        return res
          .status(400)
          .json({ error: "Missing roleName in request body" });
      }

      const roleName = req.body.roleName.toUpperCase();

      const employeesByRoleName = await prisma.user.findMany({
        where: { roleName },
      });

      res.json({ employeesByRoleName });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "An error occurred while getting employees by role name",
      });
    }
  }
);

module.exports = userRouter;

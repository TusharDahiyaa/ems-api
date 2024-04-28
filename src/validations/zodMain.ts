import { z } from "zod";

const EmployeeZodSchema = z.object({
  username: z.string().min(1),
  address: z.string(),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  roleName: z.string(),
  departmentName: z.string(),
});

const UserZodSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).optional(),
  dateOfBirth: z.string().optional(),
  roleName: z.string().optional(),
});

const RoleZodSchema = z.object({
  roleName: z.string(),
  permissions: z.array(z.string()),
});

export { EmployeeZodSchema, UserZodSchema, RoleZodSchema };

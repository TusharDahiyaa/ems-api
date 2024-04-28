const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  try {
    // Create ADMIN role (if it doesn't exist)
    const existingRole = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: {
          name: "ADMIN",
          permissions: [
            "CREATE_USER",
            "READ_USER",
            "UPDATE_USER",
            "DELETE_USER",
            "CREATE_EMPLOYEE",
            "READ_EMPLOYEE",
            "UPDATE_EMPLOYEE",
            "DELETE_EMPLOYEE",
            "CREATE_ROLE",
            "READ_ROLE",
            "UPDATE_ROLE",
            "DELETE_ROLE",
            "READ_ALL_USERS",
            "READ_ALL_EMPLOYEES",
            "READ_ALL_ROLES",
            "READ_ALL_DEPARTMENTS",
          ],
        },
      });

      await prisma.role.create({
        data: {
          name: "HR MANAGER",
          permissions: [
            "CREATE_USER",
            "UPDATE_USER",
            "CREATE_EMPLOYEE",
            "READ_EMPLOYEE",
            "UPDATE_EMPLOYEE",
            "CREATE_ROLE",
            "READ_ROLE",
            "READ_ALL_EMPLOYEES",
            "READ_ALL_DEPARTMENTS",
          ],
        },
      });

      await prisma.role.create({
        data: {
          name: "EMPLOYEE",
          permissions: ["READ_USER", "UPDATE_USER"],
        },
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });

    if (!existingUser) {
      // Create admin user with ADMIN role
      await prisma.user.create({
        data: {
          username: "admin",
          password: await bcrypt.hash("admin_secure_password", 10),
          firstName: "Admin",
          lastName: "User",
          email: "admin@yourdomain.com",
          phoneNumber: "1234567890",
          dateOfBirth: "1970-01-01",
          Role: {
            connect: {
              name: "ADMIN",
            },
          },
        },
      });

      await prisma.user.create({
        data: {
          username: "calstone",
          password: await bcrypt.hash("stone123", 10),
          firstName: "Cal",
          lastName: "Stone",
          email: "calstone@gmail.com",
          phoneNumber: "1234467890",
          dateOfBirth: "1970-01-01",
          Role: {
            connect: {
              name: "ADMIN",
            },
          },
        },
      });

      await prisma.user.create({
        data: {
          username: "benstone",
          password: await bcrypt.hash("benstone123", 10),
          firstName: "Ben",
          lastName: "Stone",
          email: "benstone@gmail.com",
          phoneNumber: "9876543210",
          dateOfBirth: "1970-01-01",
          Role: {
            connect: {
              name: "HR MANAGER",
            },
          },
        },
      });

      await prisma.user.create({
        data: {
          username: "johndoe",
          password: await bcrypt.hash("johndoe123", 10),
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@gmail.com",
          phoneNumber: "1478523690",
          dateOfBirth: "1970-01-01",
          Role: {
            connect: {
              name: "EMPLOYEE",
            },
          },
        },
      });

      await prisma.department.create({
        data: {
          name: "ENGINEERING",
        },
      });

      await prisma.employee.create({
        data: {
          username: "johndoe",
          address: "123, Main Street, CA, 2051",
          jobType: "FULL_TIME",
          departmentName: "ENGINEERING",
          roleName: "EMPLOYEE",
        },
      });

      await prisma.user.create({
        data: {
          username: "johnwick",
          password: await bcrypt.hash("johndoe123", 10),
          firstName: "John",
          lastName: "Wick",
          email: "johnwick@gmail.com",
          phoneNumber: "7412596300",
          dateOfBirth: "1972-01-01",
          Role: {
            connect: {
              name: "EMPLOYEE",
            },
          },
        },
      });

      await prisma.department.create({
        data: {
          name: "SECRET OPERATIONS",
        },
      });

      await prisma.employee.create({
        data: {
          username: "johnwick",
          address: "Horseshoe Road, Mill Neck, Long Island",
          jobType: "CONTRACT",
          departmentName: "SECRET OPERATIONS",
          roleName: "EMPLOYEE",
        },
      });
    }

    if (existingRole && existingUser) {
      console.log("Roles and Users already exist");
    }

    console.log("Multiple users,roles and departments created successfully!");
  } catch (err) {
    console.error("Error creating admin user or role:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

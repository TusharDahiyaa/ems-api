enum Permission {
  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
  CREATE_EMPLOYEE = "CREATE_EMPLOYEE",
  READ_EMPLOYEE = "READ_EMPLOYEE",
  UPDATE_EMPLOYEE = "UPDATE_EMPLOYEE",
  DELETE_EMPLOYEE = "DELETE_EMPLOYEE",
  CREATE_ROLE = "CREATE_ROLE",
  READ_ROLE = "READ_ROLE",
  UPDATE_ROLE = "UPDATE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
  READ_ALL_USERS = "READ_ALL_USERS",
  READ_ALL_EMPLOYEES = "READ_ALL_EMPLOYEES",
  READ_ALL_ROLES = "READ_ALL_ROLES",
  READ_ALL_DEPARTMENTS = "READ_ALL_DEPARTMENTS",
}

// Define required permissions for admin
const adminPermissions = [
  Permission.CREATE_USER,
  Permission.READ_USER,
  Permission.UPDATE_USER,
  Permission.DELETE_USER,
  Permission.CREATE_EMPLOYEE,
  Permission.READ_EMPLOYEE,
  Permission.UPDATE_EMPLOYEE,
  Permission.DELETE_EMPLOYEE,
  Permission.CREATE_ROLE,
  Permission.READ_ROLE,
  Permission.UPDATE_ROLE,
  Permission.DELETE_ROLE,
  Permission.READ_ALL_EMPLOYEES,
  Permission.READ_ALL_USERS,
  Permission.READ_ALL_ROLES,
  Permission.READ_ALL_DEPARTMENTS,
];

// Define required permissions for hrManager
const HRManagerPermissions = [
  Permission.CREATE_USER,
  Permission.UPDATE_USER,
  Permission.CREATE_EMPLOYEE,
  Permission.READ_EMPLOYEE,
  Permission.UPDATE_EMPLOYEE,
  Permission.DELETE_EMPLOYEE,
  Permission.READ_ROLE,
  Permission.READ_ALL_EMPLOYEES,
  Permission.READ_ALL_DEPARTMENTS,
];

// Define required permissions for employee
const employeePermissions = [Permission.READ_USER, Permission.UPDATE_USER];

export {
  Permission,
  adminPermissions,
  HRManagerPermissions,
  employeePermissions,
};

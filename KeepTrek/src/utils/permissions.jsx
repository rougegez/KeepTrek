// Store roles in lowercase to match backend
export const UserRole = {
  ADMIN: "admin",
  COLLABORATOR: "collaborator",
  VIEWER: "viewer"
};

export const ROLE_HIERARCHY = {
  [UserRole.VIEWER]: 0,
  [UserRole.COLLABORATOR]: 1,
  [UserRole.ADMIN]: 2,
};

export const hasPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) {
    console.log('Permission check failed:', { userRole, requiredRole });
    return false;
  }

  // Convert roles to lowercase for comparison
  const normalizedUserRole = userRole.toLowerCase();
  const normalizedRequiredRole = requiredRole.toLowerCase();

  // console.log('Checking permission:', { 
  //   userRole: normalizedUserRole, 
  //   requiredRole: normalizedRequiredRole, 
  //   result: ROLE_HIERARCHY[normalizedUserRole] >= ROLE_HIERARCHY[normalizedRequiredRole] 
  // });
  
  return ROLE_HIERARCHY[normalizedUserRole] >= ROLE_HIERARCHY[normalizedRequiredRole];
};

export const canEdit = (role) => hasPermission(role, UserRole.COLLABORATOR);
export const canManageUsers = (role) => hasPermission(role, UserRole.ADMIN);

import { PERMISSIONS } from '../types';

export const canView = (
  userId: string,
  permissionsObject: { [key: string]: string[] },
) => {
  if (!permissionsObject) return false;

  const userPermissions = permissionsObject[userId];
  if (!userPermissions) return false;

  return userPermissions.includes(PERMISSIONS.VIEW);
};

export const canEdit = (
  userId: string,
  permissionsObject: { [key: string]: string[] },
) => {
  if (!permissionsObject) return false;

  const userPermissions = permissionsObject[userId];
  if (!userPermissions) return false;

  return userPermissions.includes(PERMISSIONS.EDIT);
};

export const canDelete = (
  userId: string,
  permissionsObject: { [key: string]: string[] },
) => {
  if (!permissionsObject) return false;

  const userPermissions = permissionsObject[userId];
  if (!userPermissions) return false;

  return userPermissions.includes(PERMISSIONS.DELETE);
};

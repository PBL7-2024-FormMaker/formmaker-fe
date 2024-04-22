export interface UserProfileResponse {
  username: string;
  email: string;
  avatarUrl: string;
  organizationLogo: string;
  organizationName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  avatarUrl?: string;
  organizationLogo?: string;
  organizationName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

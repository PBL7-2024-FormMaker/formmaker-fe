export interface FolderResponse {
  id: string;
  name: string;
  permissions: object;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  creatorId: string;
  teamId: string;
  color?: string;
}

export interface FolderRequest {
  name: string;
  color?: string;
}

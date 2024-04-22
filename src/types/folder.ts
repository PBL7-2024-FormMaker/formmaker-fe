export interface FolderResponse {
  id: number;
  name: string;
  permissions: object;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  creatorId: number;
  teamId: number;
}

export interface FolderRequest {
  name: string;
}

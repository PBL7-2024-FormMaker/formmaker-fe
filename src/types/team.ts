export interface Member {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
}

export interface FolderInTeamResponse {
  id: number;
  name: string;
}

export interface TeamResponse {
  id: number;
  name: string;
  folders: FolderInTeamResponse[];
  logoUrl: string;
  permissions: object;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  creatorId: number;
  members: Member[];
}

export interface TeamResquest {
  name: string;
  logoUrl?: string;
}

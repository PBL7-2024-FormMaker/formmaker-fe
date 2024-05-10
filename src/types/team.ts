export interface Member {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
}

export interface FolderInTeamResponse {
  id: string;
  name: string;
}

export interface TeamResponse {
  id: string;
  name: string;
  folders: FolderInTeamResponse[];
  logoUrl: string;
  permissions: {
    [key: string]: string[];
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  creatorId: string;
  members: Member[];
}

export interface TeamResquest {
  name: string;
  logoUrl?: string;
}

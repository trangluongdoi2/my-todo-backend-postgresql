export interface User {
  userId: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export type UserCreate = {
  username: string;
  password: string;
  email: string;
};

export enum RoleUser {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export enum ProjectRole {
  OWNER = 'OWNER',
  DEVELOPER = 'DEVELOPER',
}

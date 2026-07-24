export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  userData: UserData;
  token: string;
}

export interface UserData {
  id: number;
  name: string;
  lastName: string;
  ci: string;
  email: string;
  userName: string;
  active: boolean;
  roleId: number;
  role: { id: number; name: string };
}

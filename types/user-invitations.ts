import { UserType } from "./user";

export interface UserInvitation {
  id?: string;
  email: string;
  inviterId: string;
  token: string;
  createdAt?: string | Date | undefined;
  userType?: UserType | null;
  expiresAt: string | Date;
  updatedAt?: string | Date;
  accepted?: boolean;
}

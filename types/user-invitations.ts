export interface UserInvitation {
  id?: string;
  email: string;
  inviterId: string;
  token: string;
  createdAt?: string | Date | undefined;
  expiresAt: string | Date;
  updatedAt?: string | Date;
  accepted?: boolean;
}

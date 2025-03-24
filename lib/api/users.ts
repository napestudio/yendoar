import db from "../prisma";
import { generateVerificationToken } from "../tokens";

export async function getAllUsers() {
  return await db.user.findMany();
}

export async function getAllUsersButAdmins() {
  return await db.user.findMany({ where: { type: "SELLER" } });
}

export async function getUsersByClientId() {
  return await db.user.findMany();
}

export async function getUserByEmail(email: string) {
  return await db.user.findFirstOrThrow({
    where: {
      email,
    },
  });
}

export async function getUserById(userId: string) {
  return await db.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
}

export async function updateUser(data: any, email: string) {
  const { id } = await getUserByEmail(email as string);
  return await db.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function getUserByEmailForRegister(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUser(data: any) {
  const createdUser = await db.user.create({ data });

  const verificationToken = await generateVerificationToken(data.email);
  return createdUser;
}

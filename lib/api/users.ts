import { revalidatePath } from "next/cache";
import db from "../prisma";
import { generateVerificationToken } from "../tokens";
import { User, UserType } from "@/types/user";

export async function getAllUsers() {
  return await db.user.findMany();
}

export async function getAllUsersButAdmins() {
  return await db.user.findMany({ where: { type: "SELLER" } });
}

export async function getUsersByClientId(clientId: string) {
  return await db.user.findMany({
    where: {
      clientId,
    },
    include: {
      configuration: true,
    },
  });
}

export async function getUsersByType(clientId: string, type: UserType) {
  return await db.user.findMany({
    where: {
      clientId,
      type,
    },
  });
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

export async function updateUserById(data: any, userId: string) {
  return await db.user.update({
    where: {
      id: userId,
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
  await db.userConfiguration.create({
    data: {
      userId: createdUser.id,
    },
  });
  const verificationToken = await generateVerificationToken(data.email);
  return createdUser;
}

export async function deleteUser(userId: string) {
  if (!userId) {
    throw new Error("Falta el ID del usuario");
  }

  // Verificar si tiene eventos asignados
  const hasEvents = await db.event.findFirst({
    where: {
      userId,
    },
  });

  if (hasEvents) {
    return {
      error: "Este usuario tiene eventos asignados y no se puede eliminar",
    };
  }

  // Eliminar usuario
  await db.user.delete({
    where: { id: userId },
  });

  revalidatePath("/dashboard/usuarios");

  return { success: true };
}

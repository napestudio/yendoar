import { ValidatorToken } from "@/types/validators";
import { db } from "../prisma";

export async function createValidatorToken(data: ValidatorToken) {
  return await db.validatorToken.create({ data });
}

export async function getTokensByEvent(eventId: string) {
  return await db.validatorToken.findMany({
    where: {
      eventId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function deleteTokenById(tokenId: string) {
  return await db.validatorToken.delete({
    where: {
      id: tokenId,
    },
  });
}

export async function getEventByToken(token: string) {
  return await db.validatorToken.findUnique({
    where: {
      token: token,
    },
  });
}

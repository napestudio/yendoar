import { cache } from "react";
import { Evento } from "../actions";
import { db } from "../prisma";

export async function getEventsByUserId(userId: string) {
  return await db.event.findMany({
    where: {
      userId: userId,
      status: {
        not: "DELETED",
      },
    },
    include: {
      user: true,
      discountCode: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export const getAllEvents = cache(async () => {
  return await db.event.findMany({
    where: {
      status: {
        not: "DELETED",
      },
      endDate: {
        not: {
          lte: new Date(),
        },
      },
    },
    include: {
      user: true,
    },
  });
});

export async function createEvent(data: Evento) {
  return await db.event.create({ data });
}

export async function updateEvent(eventId: string, eventData: Partial<Evento>) {
  return await db.event.update({
    where: {
      id: eventId,
    },
    data: eventData,
  });
}

export async function getEventById(eventId: string) {
  return await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: true,
      ticketTypes: true,
      discountCode: true,
    },
  });
}

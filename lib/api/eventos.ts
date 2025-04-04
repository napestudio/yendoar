import { cache } from "react";
import { Evento } from "../actions";
import db from "../prisma";
import { CLIENT_ID } from "../constants";
import { id } from "date-fns/locale";
import { equal } from "assert";

export const getEventsByUserId = cache(async (userId: string) => {
  return db.event.findMany({
    where: {
      userId: userId,
      status: {
        not: "DELETED",
      },
    },
    include: {
      user: true,
      discountCode: true,
      tickets: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export const getAllEvents = cache(async () => {
  return db.event.findMany({
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

// Get eventos home por client ID
export const getAllActiveEvents = async () => {
  return db.event.findMany({
    where: {
      status: {
        equals: "ACTIVE",
      },
      user: {
        clientId: {
          equals: CLIENT_ID,
        },
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
};

export async function createEvent(data: Evento) {
  return db.event.create({ data });
}

export async function updateEvent(eventId: string, eventData: Partial<Evento>) {
  return db.event.update({
    where: {
      id: eventId,
    },
    data: eventData,
  });
}
export const getEventById = cache(async (eventId: string) => {
  return db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: true,
      ticketTypes: {
        where: {
          status: {
            not: "DELETED",
          },
        },
      },
      eventPayments: {
        include: {
          paymentMethod: true,
        },
      },
      discountCode: true,
      validatorToken: true,
    },
  });
});

import { cache } from "react";
import { Evento } from "../actions";
import db from "../prisma";
import { CLIENT_ID } from "../constants";
import { id } from "date-fns/locale";
import { equal } from "assert";
import { Prisma } from "@prisma/client";

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

export async function getAllEventByClientId() {
  return db.event.findMany({
    where: {
      user: {
        clientId: {
          equals: CLIENT_ID,
        },
      },
    },
    include: {
      user: true,
    },
  });
}
export async function getAllActiveEventByClientId() {
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
}

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

export const getSingleEvent = cache(async (eventId: string) => {
  return db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: {
        select: {
          configuration: {
            select: {
              serviceCharge: true,
            },
          },
        },
      },
      ticketTypes: {
        where: {
          status: {
            not: "DELETED",
          },
        },
      },
      eventPayments: {
        where: {
          paymentMethod: {
            type: "DIGITAL",
          },
        },
        include: {
          paymentMethod: {
            select: {
              type: true,
              apiKey: true,
            },
          },
        },
      },
      discountCode: {
        where: {
          status: {
            not: "DELETED",
          },
        },
      },
      tickets: {
        select: {
          ticketType: {
            select: {
              title: true,
              id: true,
            },
          },
        },
      },
      validatorToken: true,
    },
  });
});
export type GetSingleEventResponse = Prisma.PromiseReturnType<
  typeof getSingleEvent
>;

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
      discountCode: {
        where: {
          status: {
            not: "DELETED",
          },
        },
      },
      tickets: {
        select: {
          name: true,
          lastName: true,
          dni: true,
          id: true,
          code: true,
          isInvitation: true,
          email: true,
          createdAt: true,
          ticketType: {
            select: {
              title: true,
              dates: true,
            },
          },
          order: {
            select: {
              event: {
                select: {
                  title: true,
                  location: true,
                  address: true,
                }
              },
              ticketType: {
                select: {
                  title: true,
                  
                },
              },
            },
          },
        },
      },
      validatorToken: true,
      
    },
  });
});

export async function getStats({
  ticketTypeId,
  eventId,
}: {
  ticketTypeId?: string;
  eventId?: string;
}) {
  if (!ticketTypeId && !eventId) {
    throw new Error("No ticketTypeId or eventId");
  }

  const where = {
    status: "PAID" as const,
    ...(ticketTypeId ? { ticketTypeId } : { eventId }),
  };

  const aggregate = await db.order.aggregate({
    _sum: {
      quantity: true,
      totalPrice: true,
    },
    _max: {
      createdAt: true,
    },

    where,
  });

  return {
    totalSold: aggregate._sum.quantity ?? 0,
    totalRevenue: aggregate._sum.totalPrice ?? 0,
    lastSale: aggregate._max.createdAt ?? null,
  };
}

export async function getEventsBySellerId(userId: string) {
  const events = await db.event.findMany({
    where: {
      eventPayments: {
        some: {
          paymentMethod: {
            type: "CASH",
            userId: userId,
          },
        },
      },
    },
    include: {
      ticketTypes: true,
      orders: true,
      user: true,
    },
  });

  return events;
}

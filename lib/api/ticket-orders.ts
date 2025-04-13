import db from "../prisma";

type TicketOrderType = {
  id?: string;
  name: string;
  lastName: string;
  dni: string;
  email: string;
  base64Qr: string;
  date: Date;
  orderId: string;
  eventId: string;
  ticketTypeId: string;
  status: "NOT_VALIDATED" | "VALIDATED";
  isInvitation?: boolean;
};

export async function createTicketOrder(data: TicketOrderType[]) {
  const createdOrders = await db.$transaction(
    data.map((order) => db.ticketOrder.create({ data: order, include:{
      ticketType: {
        select: {
          title: true,
        }
      }
    } }))
  );
  return createdOrders;
}

export async function getOrderTicketsByEvent(eventId: string) {
  return await db.ticketOrder.findMany({
    where: {
      eventId: eventId,
      order: {
        status: "PAID",
      },
    },
    orderBy: [
      {
        name: "asc",
      },
      { createdAt: "desc" },
    ],
    include: {
      order: {
        select: {
          ticketTypeId: true,
          quantity: true,
          ticketType: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });
}

export async function validateTicketById(ticketId: string, eventId: string) {
  return await db.ticketOrder.update({
    where: {
      id: ticketId,
      eventId: eventId,
    },
    data: {
      status: "VALIDATED",
    },
  });
}

export async function invalidateTicketById(ticketId: string) {
  return await db.ticketOrder.update({
    where: {
      id: ticketId,
    },
    data: {
      status: "NOT_VALIDATED",
    },
  });
}

export async function getTicketStatusById(ticketId: string) {
  return await db.ticketOrder.findUnique({
    where: { id: ticketId },
    select: {
      status: true,
    },
  });
}

export async function getTicketsByTicketTypeId(ticketTypeId: string) {
  return await db.ticketOrder.findMany({
    where: {
      order: {
        ticketTypeId: ticketTypeId,
      },
    },
  });
}

export async function getTicketOrdersByEventId(eventId: string) {
  return await db.ticketOrder.findMany({
    where: {
      eventId: eventId,
      order: {
        status: "PAID",
      },
    },
    orderBy: [
      {
        name: "asc",
      },
      { createdAt: "desc" },
    ],
    include: {
      event: { select: { title: true } },
    },
  });
}

export async function getUsedInvitesByUser(userId: string): Promise<number> {
  const events = await db.event.findMany({
    where: { userId },
    select: {
      orders: {
        where: {
          isInvitation: true,
        },
        select: {
          quantity: true,
        },
      },
    },
  });

  const totalInvites = events
    .flatMap((e) => e.orders)
    .reduce((acc, order) => acc + order.quantity, 0);
  return totalInvites;
}

export async function getUserMaxInvites(userId: string): Promise<number> {
  const config = await db.userConfiguration.findUnique({
    where: { userId },
    select: { maxInvitesAmount: true },
  });

  return config?.maxInvitesAmount ?? 0;
}

export async function getTicketOrderById(id: string) {
  return await db.ticketOrder.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          ticketType: {
            select: {
              title: true,
            }
          },
        },
      },
      event: {
        select: {
          title: true,
          address: true,
          location: true,
        },
      },
    },
  });
}

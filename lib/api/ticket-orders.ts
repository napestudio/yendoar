import { TicketOrderType } from "@/types/tickets";
import { db } from "../prisma";

export async function createTicketOrder(data: TicketOrderType[]) {
  const createdOrders = await db.$transaction(
    data.map((order) => db.ticketOrder.create({ data: order }))
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
      event: true,
      order: {
        include: {
          ticketType: true,
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
      event: true,
    },
  });
}

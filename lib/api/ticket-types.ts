import { TicketType } from "@/types/tickets";
import { db } from "../prisma";

export async function getTicketTypesById(ticketTypeId: string) {
  return await db.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
}
export async function getTicketTypesByEventId(eventId: string) {
  return await db.ticketType.findMany({
    where: {
      eventId: eventId,
      status: {
        not: "DELETED",
      },
    },
    orderBy: {
      position: "asc",
    },
  });
}

export async function createTicketType(data: TicketType) {
  return await db.ticketType.create({ data });
}

export async function updateTicketType(
  ticketId: string,
  ticketData: Partial<TicketType>
) {
  return await db.ticketType.update({
    where: {
      id: ticketId,
    },
    data: ticketData,
  });
}

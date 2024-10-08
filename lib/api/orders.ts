import { db } from "../prisma";

export async function createOrder(data: any) {
  return await db.order.create({ data });
}

export async function getOrderById(orderId: string) {
  return await db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      ticketType: true,
      event: {
        include: {
          discountCode: true,
        },
      },
    },
  });
}

export async function getOrdersByEvent(eventId: string) {
  return await db.order.findMany({
    where: {
      eventId: eventId,
      status: "PAID",
    },
    include: {
      ticketType: true,
      event: true,
      tickets: true,
    },
  });
}

// Crear type para order
export async function updateOrder(orderId: string, orderData: any) {
  return await db.order.update({
    where: {
      id: orderId,
    },
    data: orderData,
  });
}

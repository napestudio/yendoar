import { revalidatePath } from "next/cache";
import db from "../prisma";

type AssignPaymentMethodsInput = {
  eventId: string;
  paymentMethodIds: string[];
};

export async function createPaymentMethod(data: any) {
  return await db.paymentMethod.create({ data });
}

export async function getPaymentMethodsByClientId(clientId: string) {
  return await db.paymentMethod.findMany({
    where: {
      clientId,
    },
  });
}
export async function getPaymentMethodsByCreatorId(creatorId: string) {
  return await db.paymentMethod.findMany({
    where: {
      creatorId,
    },
  });
}

export async function assignPaymentMethodsToEvent({
  eventId,
  paymentMethodIds,
}: AssignPaymentMethodsInput) {
  if (!eventId || paymentMethodIds.length === 0) {
    throw new Error("Faltan datos para asociar métodos de pago");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Evento no encontrado");
  }

  // Buscar métodos de pago por ID
  const methods = await db.paymentMethod.findMany({
    where: { id: { in: paymentMethodIds } },
  });

  if (methods.length !== paymentMethodIds.length) {
    throw new Error("Algunos métodos de pago no existen");
  }

  // Obtener los ya asignados
  const existingLinks = await db.eventPayment.findMany({
    where: { eventId },
    select: { paymentMethodId: true },
  });

  const existingIds = new Set(existingLinks.map((e) => e.paymentMethodId));

  // 🔎 Filtrar solo los nuevos
  const newMethods = methods.filter((m) => !existingIds.has(m.id));

  // ⚠️ Verificar si ya hay un DIGITAL asignado
  const existingDigital = await db.eventPayment.findFirst({
    where: {
      eventId,
      paymentMethod: { type: "DIGITAL" },
    },
  });

  const newDigitalCount = newMethods.filter((m) => m.type === "DIGITAL").length;

  if (existingDigital && newDigitalCount > 0) {
    throw new Error("Ya hay un método DIGITAL asignado a este evento");
  }

  if (!existingDigital && newDigitalCount > 1) {
    throw new Error(
      "Solo se puede asignar un método de pago DIGITAL por evento"
    );
  }

  // Crear las nuevas relaciones
  await db.eventPayment.createMany({
    data: newMethods.map((m) => ({
      eventId,
      paymentMethodId: m.id,
    })),
  });

  revalidatePath(`/dashboard/events/${eventId}`);

  return { success: true };
}

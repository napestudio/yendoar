import { PrismaClient } from "@prisma/client";
import { addMonths, addYears } from "date-fns"; // Puedes usar esta función de date-fns para manipular fechas

const prisma = new PrismaClient();

async function main() {
  // Obtener la fecha actual y sumarle dos meses para endDate
  const today = new Date("2025-09-09T21:02:30.078Z");
  const endDate = addYears(today, 1); // Sumar dos meses

  const client = await prisma.client.upsert({
    where: { email: "client@yendo.com" },
    update: {},
    create: {
      name: "Cliente de Prueba",
      email: "client@yendo.com",
      city: "Rosario",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "renzocostarelli@gmail.com" },
    update: {},
    create: {
      id: "cm0vhobsu00039p6awxcj4dmt",
      name: "Renzo",
      email: "renzocostarelli@gmail.com",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocLkEO3LxK2FijarutZWmQ6KIdmWQs5iChyyUlyIrK1SF2kKWsRU=s96-c",
      type: "SUPERADMIN",
      createdAt: new Date("2025-09-09T21:02:30.078Z"),
      clientId: client.id, // 👈 ahora requerido
    },
  });

  await prisma.userConfiguration.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      mpAccessToken: "test_token_123",
      eventSoldOutNotification: true,
      ticketTypeSoldOutNotification: true,
      eventToBeSoldOutNotification: false,
      ticketTypePublishedNotification: false,
      serviceCharge: 5,
      maxInvitesAmount: 10,
      maxValidatorsAmount: 2,
      maxTicketsAmount: 200,
    },
  });

  // Crear la cuenta vinculada al usuario
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: "110198927703910120731",
      },
    },
    update: {},
    create: {
      userId: user.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "110198927703910120731",
      access_token:
        "ya29.a0AcM612wTD0k-O-Op2WZxiT7psD1ziJYe8R3LI8GArOWoB72yc8Rd5_v4_3J1z-IXK7iQGTPrBoWWwsLz7UQU4vKQgPmIa7qOA7yCkF_wtA5fFXuZd3E_ofDfiy3FQ_Gfsgef6FMuuNGLjtwf36Ep47u5UlbTH3SvktrEaCgYKAVASARESFQHGX2MiWPjSPlBKqMVROcMyYMCmzA0171",
      expires_at: 1725919349,
      token_type: "Bearer",
      scope:
        "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      id_token:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3YjkzOTc3MWE3ODAwYzQxM2Y5MDA1MTAxMmQ5NzU5ODE5MTZkNzEiLCJ0eXAiOiJKV1QifQ...",
    },
  });

  // Crear un evento con dos tipos de tickets
  const event = await prisma.event.create({
    data: {
      title: "Concierto de Prueba",
      description: "Un concierto de prueba para el sistema de ticketing",
      address: "Dirección de prueba 123",
      location: "Rosario, Argentina",
      status: "ACTIVE",
      userId: user.id, // Usamos el usuario que creamos arriba
      dates: JSON.stringify([{ id: 0, date: "2024-10-17T20:03" }]), // Formato JSON para el campo dates en Event
      endDate: endDate.toISOString(), // Convertir endDate a formato ISO string
      ticketTypes: {
        create: [
          {
            title: "Entrada General",
            price: 500,
            status: "ACTIVE",
            type: "NORMAL",
            quantity: 100,
            position: 1,
            dates: JSON.stringify([{ id: 0, date: "2024-10-18T20:03" }]), // Formato JSON para el campo dates en TicketType
          },
          {
            title: "Entrada VIP",
            price: 1000,
            status: "ACTIVE",
            type: "NORMAL",
            quantity: 50,
            position: 2,
            dates: JSON.stringify([{ id: 0, date: "2024-10-19T20:03" }]), // Formato JSON para el campo dates en TicketType
          },
        ],
      },
    },
  });

  console.log("User, Account, Event, and TicketTypes created:", {
    user,
    event,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

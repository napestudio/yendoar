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
    where: { email: "cannibal5033@gmail.com" },
    update: {},
    create: {
      id: "cm0vhobsu00039p6awxcj4dmt",
      name: "cuerojr jr",
      email: "cannibal5033@gmail.com",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocJK50KlLj5zqozLrTk8eXu1T74gYes-IYBQ6jHX2Bosbx-nCDo=s96-c",
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
        providerAccountId: "115806265136504999654",
      },
    },
    update: {},
    create: {
      userId: user.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "115806265136504999654",
      access_token:
        "a0AeXRPp6kv7CMDcIUkzTbTz2qyjf70179ZLZLd3Jct59cfoAA6NNXD9qKkg2dVdezTCoPDVT2uIpTl7Fbc2V4j7d7BKffifJH4hsbw5T091Q1lOxx53Xxt8JFyEGRjziqdmD8DLt16YePL71ZG17JuQ9B7DXMVD1qbfQdDLR1aCgYKAc0SARESFQHGX2Mi1BAUzLUqLTccsmpr7fBYqw0175",
      expires_at: 1742594718,
      token_type: "Bearer",
      scope:
        "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      id_token:
        "yJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNjc0ODg2Nzk3NDMtNTUwMGR0Nmp2anRmcnIxdWlqa3M2ajg4cWNhNmE4Z2wuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNjc0ODg2Nzk3NDMtNTUwMGR0Nmp2anRmcnIxdWlqa3M2ajg4cWNhNmE4Z2wuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTU4MDYyNjUxMzY1MDQ5OTk2NTQiLCJlbWFpbCI6ImNhbm5pYmFsNTAzM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjY0NC1HYjBxLVdsNU51RThDM3h0V2ciLCJuYW1lIjoiY3Vlcm9qciBqciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKSzUwS2xMajV6cW96THJUazhlWHUxVDc0Z1llcy1JWUJRNmpIWDJCb3NieC1uQ0RvPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6ImN1ZXJvanIiLCJmYW1pbHlfbmFtZSI6ImpyIiwiaWF0IjoxNzQyNTkxMTE5LCJleHAiOjE3NDI1OTQ3MTl9.hXiG5XpWF-VzN3b6jwdPbcmWxw5YODQNbSmCeyRTIqbJwsHXuGRHxjuFDIsNAjUdSMGQNC2ZVqo9UIWGOlCpgkGCu8AI2bBGrhO8f1tNnU1pjlYriJVtugHjZ1n2gMnm_bdmAmGVkBKuMtU1v6L8Wkwbs05ZRT9ueOqGU6P10MTIB8MZbA0nOpT9Ot-QqpGPKlHXvIOrgnv1cNEN4OGXy8hX-1kIZYZlucwlSGRQGHaCkS_xP8hHuVepaMn52DfkpN_ashJeaJizf2xB8oUyW80xNF3PqLhUraAFpAHLsrb-g4mi1Sl-TkvG_4YsHFk_c6oWyXnp10A15yrBgG78lw...",
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
      dates: JSON.stringify([{ id: 0, date: "2025-10-17T20:03" }]), // Formato JSON para el campo dates en Event
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

import {
  getAllEventByClientId,
  getAllEvents,
  getEventsBySellerId,
  getEventsByUserId,
} from "@/lib/api/eventos";
import { Evento } from "@/types/event";
import EventsHandler from "./handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function EventosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const { id, type } = session.user;

  let eventos: any[];

  switch (type) {
    case "ADMIN":
    case "SUPERADMIN":
      eventos = await getAllEventByClientId();
      break;
    case "SELLER":
      eventos = await getEventsBySellerId(id);
      break;
    default:
      eventos = await getEventsByUserId(id);
      break;
  }

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        EVENTOS
      </h1>
      <EventsHandler eventos={eventos as Evento[]} session={session} />
    </>
  );
}

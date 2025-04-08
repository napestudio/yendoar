import { getAllEvents, getEventsByUserId } from "@/lib/api/eventos";
import { Evento } from "@/types/event";
import EventsHandler from "./handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function EventosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const id = session.user.id;
  const eventos = await getAllEvents();
  session?.user.type !== "SELLER"
    ? await getAllEvents()
    : await getEventsByUserId(id);

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        EVENTOS
      </h1>
      <EventsHandler eventos={eventos as Evento[]} session={session} />
    </>
  );
}

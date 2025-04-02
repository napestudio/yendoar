import { getEventById } from "@/lib/actions";
import { Evento } from "@/types/event";

import EventDetails from "@/components/dashboard/event-details";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const evento = await getEventById(params.id);

  if (!evento) return null;
  return (
    <>
      <EventDetails evento={evento as Evento} />
      {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Editar evento
      </h1>
      <div className="bg-gray-100 p-5 rounded w-full text-left">
        <EditEventForm evento={evento as Evento} />
      </div> */}
    </>
  );
}

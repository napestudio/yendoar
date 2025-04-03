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
    </>
  );
}

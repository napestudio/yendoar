import EditEventForm from "@/app/dashboard/components/edit-event-form/edit-event-form";
import { getEventById } from "@/lib/actions";
import { Evento } from "@/types/event";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const evento = await getEventById(params.id);
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Editar evento
      </h1>
      <div className="bg-gray-100 p-5 rounded w-full text-left">
        <EditEventForm evento={evento as Evento} />
      </div>
    </>
  );
}

import DashboardHeader from "@/components/dashboard/dashboard-header";
import EditEventForm from "@/components/dashboard/edit-event-form";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/lib/actions";
import { Evento } from "@/types/event";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const evento = await getEventById(params.id);
  return (
    <>
      <div className="space-y-6 pb-8">
        <DashboardHeader
          title={`Editar evento: ${evento?.title}`}
          subtitle="Edita toda la información de este evento"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/evento/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Evento
            </Link>
          </Button>
        </div>
        <EditEventForm evento={evento as Evento} />
      </div>
    </>
  );
}

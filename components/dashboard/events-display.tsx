import { Filter, Plus } from "lucide-react";
import { Button } from "../ui/button";
import Box from "./Box";
import { Evento } from "@/types/event";
import EventCard from "@/app/dashboard/components/event-card/event-card";

export default function EventsDisplay({ eventos }: { eventos: Evento[] }) {
  return (
    <Box>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-medium">Eventos</h2>
          <p className="text-sm">Administra tus eventos</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Evento
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-3">
        {eventos &&
          eventos.map((evento) => (
            <EventCard evento={evento as Evento} key={evento.id} />
          ))}
      </div>
    </Box>
  );
}

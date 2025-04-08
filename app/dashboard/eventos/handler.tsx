"use client";
import { Evento } from "@/types/event";
import EventFilters from "../components/event-filters";
import EventCard from "../../../components/dashboard/event-card";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Session } from "next-auth";

export default function EventsHandler({
  eventos,
  session,
}: {
  eventos: Evento[];
  session: Session;
}) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users = eventos.reduce((acc: any[], evento: any) => {
    if (evento.user && !acc.find((user) => user.id === evento.user.id)) {
      acc.push(evento.user);
    }
    return acc;
  }, []);

  const filterEventsByUser = (userId: string) => {
    return eventos.filter((evento) => evento.user?.id === userId);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  const filteredEvents = selectedUser
    ? filterEventsByUser(selectedUser)
    : eventos;

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <EventFilters users={users} action={handleUserSelect} />
      {eventos &&
        filteredEvents.map((evento) => (
          <EventCard
            evento={evento as Evento}
            key={evento.id}
            session={session}
          />
        ))}
      {eventos.length == 0 && (
        <Card className="p-6">No hay eventos creados.</Card>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";

import { getEventsByUserId } from "@/lib/api/eventos";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import EventCard from "./components/event-card/event-card";
import { Evento } from "@/types/event";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Card } from "@/components/ui/card";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const id = session.user.id;
  const eventos = await getEventsByUserId(id);

  return (
    <>
      <div className="flex flex-col items-center gap-8 md:p-8">
        <div className="flex items-center gap-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            MIS EVENTOS
          </h1>
          <Button asChild variant="secondary">
            <Link href={"/dashboard/nuevo-evento"}>
              <Plus className="mr-2" /> Crear evento
            </Link>
          </Button>
        </div>
        <div className="w-full space-y-5">
          {eventos &&
            eventos.map((evento) => (
              <EventCard evento={evento as Evento} key={evento.id} />
            ))}
          {eventos.length == 0 && (
            <Card className="p-6">No hay eventos creados.</Card>
          )}
        </div>
      </div>
    </>
  );
}

import { Button } from "@/components/ui/button";

import { getEventsByUserId } from "@/lib/api/eventos";
import { DollarSign, Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import EventCard from "../../components/dashboard/event-card";
import { Evento } from "@/types/event";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import StatsCards from "@/components/dashboard/stats-cards";
import EventsDisplay from "@/components/dashboard/events-display";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const id = session.user.id;

  const eventos = await getEventsByUserId(id);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex gap-5">
          <DashboardHeader
            title="Dashboard"
            subtitle="Administra tus eventos y venta de tickets"
          />
        </div>
        <div className="w-full space-y-5">
          {/* <StatsCards /> */}
          <EventsDisplay eventos={eventos as Evento[]} />

          {eventos.length === 0 && (
            <Card className="p-6">
              <CardContent>No hay eventos creados.</CardContent>
              <CardFooter>
                <Button asChild variant="secondary">
                  <Link href={"/dashboard/nuevo-evento"}>
                    <Plus className="mr-2" /> Crear evento
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

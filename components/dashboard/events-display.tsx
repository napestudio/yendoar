"use client";
import { Filter, Plus } from "lucide-react";
import { Button } from "../ui/button";
import Box from "./box";
import { Evento } from "@/types/event";
import EventCard from "@/app/dashboard/components/event-card/event-card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function EventsDisplay({ eventos }: { eventos: Evento[] }) {
  const [activeTab, setActiveTab] = useState("upcoming");

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
      <Tabs
        defaultValue="upcoming"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mt-4">
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="past">Pasados</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-cols-1">
            {eventos &&
              eventos.map((evento) => (
                <EventCard evento={evento as Evento} key={evento.id} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </Box>
  );
}

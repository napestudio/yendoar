"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgePercent,
  BarChartIcon,
  Calendar,
  FileEditIcon,
  KeyIcon,
  MapPin,
  TicketIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Evento } from "@/types/event";
import { deleteEvent } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import AlertRemove from "../../app/dashboard/components/alert-remove/alert-remove";
import { datesFormater } from "@/lib/utils";

export default function EventCard({ evento }: { evento: Evento }) {
  const groupedDates = datesFormater(evento.dates as string);
  const handleDeleteEvent = () => {
    deleteEvent(evento.id)
      .then(() => {
        toast({
          title: "Evento Eliminado",
        });
      })
      .catch((error: string) => {
        toast({
          variant: "destructive",
          title: "Error eliminando el evento",
        });
      });
  };

  return (
    <>
      <Card className="w-full text-left" key={evento.id}>
        <CardHeader className="flex gap-2 p-0">
          <div className="relative h-48 w-full">
            <Image
              src={evento.image || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute right-2 top-2 bg-black rounded-full text-white px-3 py-1">
              {evento.user!.name}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-1">
            <div>
              <CardTitle className="text-lg mb-4">{evento.title}</CardTitle>
              <CardDescription>
                <span className="flex items-center gap-2 mb-2">
                  <MapPin className="mr-1 h-4 w-4" />
                  {evento.location}
                </span>
                <span className="flex items-center gap-2 mb-4">
                  <Calendar className="mr-1 h-4 w-4" />
                  {groupedDates}
                </span>
                <span className="space-y-2">
                  <span className="flex justify-between text-sm font-bold">
                    <span>Tickets vendidos</span>
                    <span>100 / 1200</span>
                  </span>
                </span>
              </CardDescription>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 p-4">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/evento/${evento.id}`}>Detalles</Link>
          </Button>
          <Button>
            <Link
              href={`/dashboard/evento/ticket-types/${evento.id}`}
              className="flex items-center gap-2"
            >
              <TicketIcon className="w-6 h-6" /> Tickets
            </Link>
          </Button>
          {/* <Link href={`/dashboard/evento/${evento.id}`}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <FileEditIcon className="w-6 h-6" />
                  <span className="sr-only">Editar</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar evento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href={`/dashboard/evento/ticket-types/${evento.id}`}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <TicketIcon className="w-6 h-6" />
                  <span className="sr-only">Tickets</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tickets</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href={`/dashboard/evento/${evento.id}/estadisticas`}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <BarChartIcon className="w-6 h-6" />
                  <span className="sr-only">Estadisticas</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estadisticas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <Link href={`/dashboard/evento/${evento.id}/validadores`}>
            <KeyIcon className="w-6 h-6" />
            <span className="sr-only">Tokens</span>
          </Link>
          <AlertRemove
            text="Está acción no se puede revertir. El evento se eliminará permanentemente."
            action={handleDeleteEvent}
          >
            <Button size="icon" variant="destructive">
              <TrashIcon className="w-6 h-6" />
              <span className="sr-only"> Eliminar </span>
            </Button>
          </AlertRemove> */}
        </CardFooter>
      </Card>
    </>
  );
}

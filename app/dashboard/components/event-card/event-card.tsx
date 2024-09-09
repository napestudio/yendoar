"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgePercent,
  BarChartIcon,
  FileEditIcon,
  KeyIcon,
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
import AlertRemove from "../alert-remove/alert-remove";
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
        <CardHeader className="flex flex-row items-center gap-2">
          {evento.image && (
            <Image
              src={evento.image || ""}
              alt="text"
              width={100}
              height={100}
              className="object-cover aspect-square rounded-sm"
            />
          )}
          <div className="grid gap-1">
            <Link
              href={"#"}
              className="font-bold text-sm uppercase text-gray-500"
            >
              {evento.user!.name}
            </Link>
            <div>
              <CardTitle className="text-xl">{evento.title}</CardTitle>
              <CardDescription>{groupedDates}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between gap-4">
          <Link href={`/dashboard/evento/${evento.id}`}>
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
          </AlertRemove>
        </CardFooter>
      </Card>
    </>
  );
}

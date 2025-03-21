import { getEventById } from "@/lib/actions";
import EditEventForm from "../../../../components/dashboard/edit-event-form";
import { Evento } from "@/types/event";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Edit,
  MapPin,
  Share2,
  Trash,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { datesFormater } from "@/lib/utils";
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
      {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Editar evento
      </h1>
      <div className="bg-gray-100 p-5 rounded w-full text-left">
        <EditEventForm evento={evento as Evento} />
      </div> */}
    </>
  );
}

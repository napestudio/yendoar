import {
  getEventById,
  getServiceCharge,
  getSoldTicketsByType,
} from "@/lib/actions";
import { datesFormater } from "@/lib/utils";
import TicketTypePicker from "@/components/ticket-type-picker/ticket-type-picker";
import EventHeader from "@/components/event-header/event-header";
import { Evento as EventoType } from "@/types/event";
import { DiscountCode } from "@/types/discount-code";
import { Suspense } from "react";
import Loader from "../loader";
import { Metadata, ResolvingMetadata } from "next";
import { getAllEvents } from "@/lib/api/eventos";

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const evento = await getEventById(params.id);

  return {
    title: `${evento?.title} | ${evento?.location}`,
    description: evento?.description,

    openGraph: {
      title: `${evento?.title} | ${evento?.location}`,
      description: evento?.description,
      images: evento?.image ? [{ url: evento.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${evento?.title} | ${evento?.location}`,
      description: evento?.description,
      images: evento?.image ? [{ url: evento.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({
    id: event.id,
  }));
}

// Genera props estáticos con datos del evento al momento de la compilación
export async function getEventData(id: string) {
  const evento = await getEventById(id);
  if (!evento) return;
  const serviceCharge = await getServiceCharge(evento.userId);
  const soldTickets = await getSoldTicketsByType(evento.id);

  return {
    evento,
    serviceCharge,
    soldTickets,
  };
}

export default async function Evento({ params }: { params: { id: string } }) {
  const eventData = await getEventData(params.id);

  if (!eventData) {
    return <p>Evento no encontrado.</p>;
  }

  const { evento, serviceCharge, soldTickets } = eventData;

  const groupedDates = datesFormater(evento?.dates as string);

  const discountCode =
    evento?.discountCode &&
    (evento.discountCode as DiscountCode[]).filter(
      (dc) => dc.status !== "DELETED"
    );

  return (
    <Suspense fallback={<Loader />}>
      <EventHeader evento={evento as EventoType} dates={groupedDates} />

      <section className="w-[50rem] max-w-[95vw] mx-auto py-6 md:py-12 mt-[3rem]">
        <h2 className="mb-14 mt-10 scroll-m-20 text-4xl tracking-tight lg:text-7xl text-white text-stroke text-center">
          <span className="font-bold">Comprá tu </span>
          <span className="font-thin">entrada</span>
        </h2>
        <div className="md:flex w-[90vw] md:w-full max-w-[90vw] mx-auto align-center justify-center">
          {evento?.ticketTypes && (
            <TicketTypePicker
              tickets={evento?.ticketTypes}
              eventId={evento?.id}
              soldTickets={soldTickets}
              discountCode={
                evento?.discountCode &&
                (evento.discountCode as DiscountCode[]).filter(
                  (dc) => dc.status !== "DELETED"
                ).length > 0
                  ? (evento.discountCode as DiscountCode[]).filter(
                      (dc) => dc.status !== "DELETED"
                    )
                  : undefined
              }
              serviceCharge={serviceCharge || undefined}
            />
          )}
        </div>
      </section>
    </Suspense>
  );
}

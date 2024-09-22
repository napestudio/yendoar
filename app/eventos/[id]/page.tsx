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
      images: evento?.image ? [{ url: evento.image }] : [],
    },
  };
}

export default async function Evento({ params }: { params: { id: string } }) {
  const evento = await getEventById(params.id);
  const groupedDates = datesFormater(evento?.dates as string);
  let serviceCharge;
  let soldTickets;
  if (evento) {
    const sC = await getServiceCharge(evento?.userId);
    serviceCharge = sC || null;
    soldTickets = await getSoldTicketsByType(evento.id);
  }

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

import { getEventById, getServiceCharge } from "@/lib/actions";
import Image from "next/image";
import { CalendarIcon, MapPin } from "lucide-react";
import { datesFormater } from "@/lib/utils";
import TicketTypePicker from "@/components/ticket-type-picker/ticket-type-picker";
import EventHeader from "@/components/event-header/event-header";
import { Evento as EventoType } from "@/types/event";
import { getAllUserConfiguration } from "@/lib/api/user-configuration";
import { DiscountCode } from "@/types/discount-code";
import { Suspense } from "react";
import Loader from "../loader";

export default async function Evento({ params }: { params: { id: string } }) {
  const evento = await getEventById(params.id);
  const groupedDates = datesFormater(evento?.dates as string);
  let serviceCharge;
  if (evento) {
    const sC = await getServiceCharge(evento?.userId);
    serviceCharge = sC || null;
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

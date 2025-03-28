import BuyTicketForm from "@/components/dashboard/buy-ticket-form";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import {
  getEventById,
  getServiceCharge,
  getSoldTicketsByType,
} from "@/lib/actions";
import { DiscountCode } from "@/types/discount-code";
import React from "react";

async function getEventData(id: string) {
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

async function Caja({ params }: { params: { id: string } }) {
  const eventData = await getEventData(params.id);
  if (!eventData) {
    return <p>Evento no encontrado.</p>;
  }
  const { evento, serviceCharge, soldTickets } = eventData;

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex gap-5">
          <DashboardHeader title="Caja" subtitle={evento.title} />
        </div>
        <div className="w-full space-y-5">
          <BuyTicketForm
            tickets={evento?.ticketTypes}
            eventId={evento.id}
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
        </div>
      </div>
    </>
  );
}

export default Caja;

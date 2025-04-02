import BuyTicketForm from "@/components/dashboard/buy-ticket-form";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  getEventById,
  getServiceCharge,
  getSoldTicketsByType,
} from "@/lib/actions";
import { DiscountCode } from "@/types/discount-code";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
      <div className="space-y-6 pb-8">
        <DashboardHeader
          title={`Venta de tickets del evento: ${evento.title}`}
          subtitle="Completa el formulario para emitir un ticket cobrando en efectivo."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/evento/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Evento
            </Link>
          </Button>
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

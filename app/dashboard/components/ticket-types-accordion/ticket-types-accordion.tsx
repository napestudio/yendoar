"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Evento } from "@/types/event";
import EditTycketTypeForm from "../edit-ticket-type-form/edit-ticket-type-form";
import { TicketType } from "@/types/tickets";
import TycketTypeForm from "../ticket-type-form/ticket-type-form";
import { useState } from "react";

export default function TicketTypeAccordion({
  evento,
  ticketTypes,
}: {
  ticketTypes: TicketType[];
  evento: Evento;
}) {
  const [type, setType] = useState<string>("");
  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-gray-50 p-5 rounded w-full">
          {ticketTypes.length > 0 ? (
            <Accordion collapsible type="single">
              {ticketTypes.map((ticket) => (
                <AccordionItem value={ticket.id as string} key={ticket.id}>
                  <AccordionTrigger>{ticket.title}</AccordionTrigger>
                  <AccordionContent>
                    <EditTycketTypeForm evento={evento} ticket={ticket} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <h1>No hay tickets creados</h1>
          )}
        </div>
        <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Nuevo tipo de ticket
        </h2>
        <div className="bg-gray-50 p-5 rounded">
          <TycketTypeForm evento={evento} />
        </div>
      </div>
    </div>
  );
}

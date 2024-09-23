"use client";
import { Evento } from "@/types/event";
import { TicketOrderType } from "@/types/tickets";

type Props = {
  ticketsData: Partial<TicketOrderType>[];
  soldCount?: any;
};

export default function ValidatorsPageHeader({
  ticketsData,
  soldCount = 0,
}: Props) {
  const validatedTicketsCount = ticketsData.filter(
    (ticket) => ticket.status === "VALIDATED"
  ).length;
  const firstTicket = ticketsData[0];

  return (
    <div className="bg-gray-50 py-10">
      <div>
        {firstTicket && "event" in firstTicket && (
          <h1 className="text-3xl font-bold mb-4 uppercase">
            {(firstTicket as { event: Evento }).event.title}
          </h1>
        )}
        <div className="pl-2">
          <ul className="space-y-1">
            <li>
              <span className="font-bold">Entradas vendidas:</span>{" "}
              {ticketsData.length}
            </li>
            <li>
              <span className="font-bold">Entradas validadas:</span>{" "}
              {validatedTicketsCount}
            </li>
            <li>
              <span className="font-bold">Entradas no validadas:</span>{" "}
              {ticketsData.length - validatedTicketsCount}
            </li>
            {Object.entries(soldCount).map(([ticketId, ticketData]) => (
              <li key={ticketId}>
                {/* @ts-ignore */}
                <span className="font-bold">{ticketData.title}</span>{" "}
                {/* @ts-ignore */}
                {ticketData.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

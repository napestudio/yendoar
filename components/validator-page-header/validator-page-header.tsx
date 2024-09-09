"use client";
import { Evento } from "@/types/event";
import { TicketOrderType } from "@/types/tickets";

type Props = {
  ticketsData: Partial<TicketOrderType>[];
};

export default function ValidatorsPageHeader({ ticketsData }: Props) {
  const ticketTitleCounts = ticketsData.reduce((acc, ticket) => {
    // @ts-ignore
    const title = ticket.order?.ticketType?.title;

    if (title) {
      if (!acc[title]) {
        acc[title] = 0;
      }
      acc[title] += 1;
    }

    return acc;
  }, {} as Record<string, number>);

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
            {Object.entries(ticketTitleCounts).map(([title, count]) => (
              <li key={title}>
                <span className="font-bold">{title}:</span> {count} tickets
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

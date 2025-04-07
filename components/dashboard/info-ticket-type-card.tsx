import { Edit, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketType } from "@/types/tickets";
import Link from "next/link";
import { getStats } from "@/lib/api/eventos";
import InfoTicketTypeCardActions from "./info-ticket-type-card-actions";

interface TicketTypeCardProps {
  ticket: {
    name: string;
    price: number;
    sold: number;
    total: number;
  };
}

export default async function InfoTicketTypeCard({
  ticket,
}: {
  ticket: TicketType;
}) {
  //   const soldPercentage = Math.round((ticket.sold / ticket.total) * 100)
  if (!ticket || !ticket.id) return;
  const ticketTypeId = ticket.id;

  const stats = await getStats({ ticketTypeId: ticketTypeId });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">{ticket.title}</h3>
            <p className="text-2xl font-bold">${ticket.price.toFixed(2)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <InfoTicketTypeCardActions ticket={ticket} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex gap-5 text-sm">
            <span>Vendidas</span>
            <span>{stats.totalSold | 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

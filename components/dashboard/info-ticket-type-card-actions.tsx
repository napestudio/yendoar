import Link from "next/link";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { TicketType } from "@/types/tickets";
import { Edit } from "lucide-react";

export default function InfoTicketTypeCardActions({
  ticket,
}: {
  ticket: TicketType;
}) {
  return (
    <>
      <DropdownMenuItem>
        <Edit className="mr-2 h-4 w-4" />
        <Link href={`/dashboard/evento/${ticket.eventId}/edit?tab=tickets`}>
          Editar ticket
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Pausar ventas</DropdownMenuItem>
      <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
    </>
  );
}

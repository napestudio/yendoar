"use client";
import {
  Check,
  Copy,
  Filter,
  Globe,
  Key,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Trash,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ValidatorToken } from "@/types/validators";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import Box from "./box";
import { deleteTokenById } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { TicketOrderType } from "@/types/tickets";
import { format } from "date-fns";
import { Input } from "../ui/input";

export default function SoldTicketsTable({
  tickets,
}: {
  tickets: TicketOrderType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyInvitations, setShowOnlyInvitations] = useState(false);

  const filteredEvents = tickets
    .filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.ticketType
          ?.title!.toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .filter((event) => (showOnlyInvitations ? event.isInvitation : true));

  console.log(tickets);
  return (
    <div className="space-y-6">
      {tickets.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px]"
            />
            <Button
              variant={showOnlyInvitations ? "default" : "outline"}
              onClick={() => setShowOnlyInvitations((prev) => !prev)}
            >
              {showOnlyInvitations ? "Ver todos" : "Ver invitados"}
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comprador</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-start flex-col ">
                        <div className="font-bold">
                          {ticket.name} {ticket.lastName}
                        </div>
                        <div className="text-xs">{ticket.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.dni}</TableCell>
                    <TableCell className="font-medium">
                      {ticket.ticketType?.title}
                    </TableCell>
                    <TableCell className="font-medium">
                      {format(ticket.createdAt!, "dd/MM/yyyy")}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <Box>
          <p className="font-bold text-gray-500">No hay tokens creados.</p>
        </Box>
      )}
    </div>
  );
}

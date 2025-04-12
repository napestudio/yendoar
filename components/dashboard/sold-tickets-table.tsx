"use client";
import { MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import Box from "./box";
import { TicketOrderTableProps, TicketOrderType } from "@/types/tickets";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { downloadPdfFile, getTicketOrderById, setQrCode } from "@/lib/actions";



export default function SoldTicketsTable({
  tickets,
}: {
  tickets: TicketOrderTableProps[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyInvitations, setShowOnlyInvitations] = useState(false);

  const filteredEvents = tickets
    .filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.order?.ticketType
          ?.title!.toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .filter((event) => (showOnlyInvitations ? event.isInvitation : true));

  const handleTicketDownload = async (ticketId: string) => {
    const response = await getTicketOrderById(ticketId);
    if (!response) return;
    downloadPdfFile(response);
  };

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
                      {ticket.order?.ticketType?.title}
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full inline-flex gap-1 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md cursor-pointer"
                              onClick={() => handleTicketDownload(ticket.id!)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-file-image-icon lucide-file-image w-4 h-4"
                              >
                                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                <circle cx="10" cy="12" r="2" />
                                <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />
                              </svg>{" "}
                              Descargar
                            </Button>
                          </DropdownMenuItem>
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

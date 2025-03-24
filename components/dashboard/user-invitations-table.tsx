"use client";
import { UserInvitation } from "@/types/user-invitations";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { UserType } from "@/types/user";
import { Badge } from "../ui/badge";
import { format, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash, UserPlus } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { formatDatesByMonth } from "@/lib/utils";
import { addDays, isAfter, isBefore, isSameDay } from "date-fns";

export default function UserInvitationsTable({
  invitations,
}: {
  invitations: UserInvitation[];
}) {
  const getRoleBadge = (role: UserType) => {
    switch (role) {
      case "SUPERADMIN":
        return (
          <Badge variant="outline" className="bg-yellow text-gray-800">
            SUPERADMIN
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="outline" className="bg-purple-500/20 text-purple-700">
            ADMIN
          </Badge>
        );
      case "PRODUCER":
        return (
          <Badge variant="outline" className="bg-green text-white">
            PRODUCER
          </Badge>
        );
      case "SELLER":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-700">
            SELLER
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatus = (accepted: boolean, date: string | Date) => {
    const dayAfter = addDays(date, 1);

    if (accepted === false && isBefore(new Date(), date)) {
      return "PENDIENTE";
    }
    if (accepted === false && isAfter(dayAfter, date)) {
      return "VENCIDA";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de invitaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de invitación</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{invitation.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(invitation.role || "PRODUCER")}
                  </TableCell>
                  {invitation.createdAt && (
                    <TableCell>
                      {format(invitation.createdAt, "dd MMM yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                  )}
                  <TableCell>
                    {format(invitation.expiresAt, "dd MMM yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    {getStatus(
                      invitation.accepted || false,
                      invitation.expiresAt
                    )}
                  </TableCell>
                  {/* {customer.type !== "SUPERADMIN" && ( */}
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

                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Editar Rol
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Cancelar invitación
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {/* )} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { datesFormater } from "@/lib/utils";
import { UserInvitation } from "@/types/user-invitations";

import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { removeInvitationById } from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InvitationsTable({
  invitations,
}: {
  invitations: UserInvitation[];
}) {
  const handleDeleteInvitation = (id: string) => {
    removeInvitationById(id)
      .then(() => {
        toast({
          title: "Invitación Eliminada",
          variant: "destructive",
        });
      })
      .catch((error: string) => {
        toast({
          variant: "destructive",
          title: "Error eliminando la invitación",
        });
      });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">E-mail</TableHead>
          {/* <TableHead>Aceptado</TableHead> */}
          <TableHead>Enviada</TableHead>
          {/* <TableHead>Expira el</TableHead> */}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow
            key={invitation.id}
            className={`${invitation.accepted ? "bg-emerald-200" : ""}`}
          >
            <TableCell className="font-bold">{invitation.email}</TableCell>
            {/* <TableCell className="text-center">
              <div
                className={`${
                  invitation.accepted ? "bg-green-600" : "bg-red-600"
                } rounded-full aspect-square h-5 w-5 mx-auto`}
              ></div>
            </TableCell> */}
            {invitation.createdAt && (
              <TableCell>
                {datesFormater(
                  JSON.stringify([{ id: 1, date: invitation.createdAt }])
                )}
              </TableCell>
            )}
            {/* <TableCell>
              {format(invitation.expiresAt, "dd MMM yyyy", { locale: es })}
            </TableCell> */}
            <TableCell className="flex items-center gap-2">
              {/* <Link href={`#`}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger>
                      <MailPlus />
                      <span className="sr-only">Re-enviar invitación</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Re-enviar invitación</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="destructive">
                    <TrashIcon className="w-6 h-6" />
                    <span className="sr-only"> Eliminar </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar</AlertDialogTitle>
                    <AlertDialogDescription>
                      Eliminar invitación?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex gap-4 items-center">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteInvitation(invitation.id!)}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

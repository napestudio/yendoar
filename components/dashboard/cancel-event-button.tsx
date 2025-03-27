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
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { LucideTicket, Ticket, TicketIcon, Trash, X } from "lucide-react";
import { cancelEvent, updateEvent } from "@/lib/actions";

type AlertRemoveType = {
  id: string;
};

export default async function CancelEventButton({ id }: AlertRemoveType) {
  const handleCancel = () => {
    cancelEvent(id);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <X className="mr-2 h-4 w-4" />
          Cancelar Evento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Evento</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cancelará el evento y no se podrá deshacer. ¿Estás
            seguro de que deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-4 items-center">
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>
            Cancelar evento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { User } from "@/types/user";

import Link from "next/link";
import { Settings, Trash, TrashIcon } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
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

export default function AccountsTable({ accounts }: { accounts: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="w-[100px]">E-mail</TableHead>
          {/* <TableHead>Fecha de alta</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.length > 0 &&
          accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.name}</TableCell>
              <TableCell className="font-medium max-w-[150px] overflow-hidden overflow-ellipsis">
                {account.email}
              </TableCell>
              {/* <TableCell className="font-medium">
                {format(account.createdAt!, "dd MMM yyyy", { locale: es })}
              </TableCell> */}
              {account.type === "SELLER" && (
                <>
                  <TableCell>
                    <Link href={`clientes/${account.id}/configuracion`}>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Settings />
                            <span className="sr-only">Configuración</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Configuración</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="-ml-3"
                        >
                          <TrashIcon />
                          <span className="sr-only"> Eliminar </span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Eliminar cuenta? Esto eliminara los eventos creados
                            por esta cuenta. Este cambio no se puede revertir
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex gap-4 items-center">
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Evento } from "@/types/event";
import { Percent, Ticket, User } from "lucide-react";

import MinimalEventSalesStats from "../mininimal-event-sales-stats";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DiscountCodeDialog } from "./discount-code-dialog";

interface SideBarProps {
  evento: Evento;
  isSeller: boolean;
  isEventOwner: boolean;
  remainingInvites: number;
  remainingTickets: number;
}
export default function SideBar({
  evento,
  isSeller,
  isEventOwner,
  remainingInvites,
  remainingTickets,
}: SideBarProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ventas</CardTitle>{" "}
        </CardHeader>
        <CardContent className="space-y-4">
          <MinimalEventSalesStats eventId={evento.id} />
          {/* <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vendidas</span>
                    <span>100 / 1200</span>
                  </div>
    
                  <p className="text-xs text-muted-foreground">
                    90% de tickets vendidos
                  </p>
                </div> */}

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Acciones Rápidas</h4>
            <div className="grid gap-2">
              <Button
                asChild
                size="sm"
                disabled={evento.status === "CANCELED" || remainingTickets <= 0}
              >
                <Link
                  href={`/dashboard/evento/${evento.id}/vender-entrada`}
                  className={cn(
                    evento.status === "CANCELED" &&
                      "opacity-50 pointer-events-none"
                  )}
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Vender entrada
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={evento.status === "CANCELED" || remainingInvites <= 0}
              >
                <User className="mr-2 h-4 w-4" />
                Agregar invitado
              </Button>
            </div>
          </div>
          {!isSeller && isEventOwner && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Promociones</h4>
                <div className="grid gap-2">
                  <DiscountCodeDialog evento={evento}>
                    <Card className="border-gray-400 p-2 cursor-pointer hover:bg-gray-50 flex justify-center items-center font-medium border-2">
                      <Percent className="mr-2 h-4 w-4" />
                      Códigos de descuento
                    </Card>
                  </DiscountCodeDialog>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Estado</h4>
            <Badge variant="secondary">{evento.status}</Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Creado por</h4>
            <p className="text-sm">{evento.user?.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Dirección</h4>
            <p className="text-sm">
              {evento.address} | {evento.location}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

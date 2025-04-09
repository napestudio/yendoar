import PaymentMethodsLoader from "@/app/dashboard/metodos-de-pago/methods-loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Evento } from "@/types/event";
import DeleteEventButton from "../delete-event-button";
import PaymentMethodsList from "../payment-methods-list";

interface DetailsTabProps {
  evento: Evento;
  isSeller: boolean;
  isEventOwner: boolean;
}

export default function DetailsTab({
  evento,
  isSeller,
  isEventOwner,
}: DetailsTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Descripción del evento</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{evento.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dirección</CardTitle>
          <CardDescription>
            {evento.location} | {evento.address}
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
                            <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                              <MapPin className="h-8 w-8 text-muted-foreground" />
                              <span className="ml-2 text-muted-foreground">
                                Map view would appear here
                              </span>
                            </div>
                          </CardContent> */}
      </Card>
      {!isSeller && isEventOwner && (
        <div className="flex flex-col max-w-[90vw] gap-5">
          {evento.eventPayments && evento.eventPayments?.length > 0 && (
            <PaymentMethodsList methods={evento.eventPayments} />
          )}

          {evento.eventPayments && evento.user?.clientId && (
            <>
              {evento.eventPayments && (
                <PaymentMethodsLoader
                  clientId={evento.user.clientId}
                  eventId={evento.id}
                />
              )}
            </>
          )}
        </div>
      )}
      {!isSeller && isEventOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Eliminar evento permanentemente</CardTitle>
            <CardDescription>
              Esta acción no se puede revertir. Por favor, asegúrate de que
              deseas eliminar este evento antes de continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteEventButton id={evento.id} />
          </CardContent>
        </Card>
      )}
    </>
  );
}

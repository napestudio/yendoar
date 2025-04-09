import { Evento } from "@/types/event";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  Globe,
  KeyIcon,
  MapPin,
  Plus,
  Share2,
  Ticket,
  Trash,
  User,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { cn, datesFormater } from "@/lib/utils";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import InfoTicketTypeCard from "./info-ticket-type-card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import DashboardHeader from "./dashboard-header";
import { SITE_URL } from "@/lib/constants";
import ValidatorsTable from "./validators-table";
import { ValidatorToken } from "@/types/validators";
import NewTokenDialog from "@/app/dashboard/components/new-token-dialog/new-token-dialog";
import CancelEventButton from "./cancel-event-button";
import PaymentMethodsList from "./payment-methods-list";
import { PaymentMethod } from "@prisma/client";
import PaymentMethodsLoader from "@/app/dashboard/metodos-de-pago/methods-loader";
import DeleteEventButton from "./delete-event-button";
import { redirect } from "next/navigation";
import MinimalEventSalesStats from "./mininimal-event-sales-stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUsedInvitesByUser, getUserMaxInvites } from "@/lib/actions";
import { AddInvitationMethodDialog } from "./add-invitation-method-dialog";
export default async function EventDetails({ evento }: { evento: Evento }) {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const groupedDates = datesFormater(evento.dates as string);
  if (evento.status === "DELETED") {
    redirect("/dashboard");
  }

  const isEventOwner =
    session.user.id === evento.userId ||
    session.user.type === "ADMIN" ||
    session.user.type === "SUPERADMIN";
  const isSeller = session.user.type === "SELLER";

  const maxInvitesAmount = await getUserMaxInvites(evento.userId);
  const usedInvites = await getUsedInvitesByUser(evento.userId);
  const remainingInvites = maxInvitesAmount - usedInvites;

  return (
    <>
      <div className="space-y-6">
        <DashboardHeader
          title={evento.title}
          subtitle="Administra los datos de este evento"
        />
        <div className="flex items-start md:items-center flex-wrap  gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Eventos
            </Link>
          </Button>
          {evento.status !== "CANCELED" && (
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                <Link
                  href={`${SITE_URL}/eventos/${evento.id}`}
                  className="flex items-center"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Ver en la web
                </Link>
              </Button>
              {!isSeller && isEventOwner && (
                <>
                  <Button variant="outline" size="sm">
                    <Link
                      href={`/dashboard/evento/${evento.id}/edit`}
                      className="flex items-center"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>

                  <CancelEventButton id={evento.id} />
                </>
              )}
            </div>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-5 space-y-6">
            <Card>
              <div className="relative h-[180px] md:h-[300px] w-full">
                <Image
                  src={evento?.image || "/placeholder.svg"}
                  alt={evento.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute right-2 top-2 bg-black rounded-full text-white px-3 py-1">
                  {evento.status}
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{groupedDates}</span>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{evento.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Creado por {evento.user?.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Detalles</TabsTrigger>
                <TabsTrigger
                  value="tickets"
                  disabled={isSeller || !isEventOwner}
                >
                  Tickets
                </TabsTrigger>
                <TabsTrigger
                  value="validators"
                  disabled={isSeller || !isEventOwner}
                >
                  Validadores
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
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
                    {evento.eventPayments &&
                      evento.eventPayments?.length > 0 && (
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
                        Esta acción no se puede revertir. Por favor, asegúrate
                        de que deseas eliminar este evento antes de continuar.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DeleteEventButton id={evento.id} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="tickets" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tipos de tickets</CardTitle>
                    <CardDescription>
                      Administra tus tickets y precios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {evento.ticketTypes &&
                      evento.ticketTypes.map((ticket, index) => (
                        <InfoTicketTypeCard key={index} ticket={ticket} />
                      ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">
                      <Link
                        href={`/dashboard/evento/${evento.id}/edit?tab=tickets`}
                        className="flex items-center"
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        Agregar tipo de ticket
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="validators" className="space-y-6">
                <Card className="max-w-[90vw]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Tokens de validación</CardTitle>
                      <CardDescription>
                        Administra los tokens de validación de este evento
                      </CardDescription>
                    </div>
                    <NewTokenDialog eventId={evento.id} />
                  </CardHeader>
                  <CardContent>
                    {evento.validatorToken && (
                      <ValidatorsTable
                        tokens={evento.validatorToken as ValidatorToken[]}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-2 space-y-6">
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

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Acciones Rápidas</h4>
                  <div className="grid gap-2">
                    <Button
                      asChild
                      size="sm"
                      disabled={evento.status === "CANCELED"}
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
                    <AddInvitationMethodDialog
                      session={session}
                      evento={evento}
                      remainingInvites={remainingInvites}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          evento.status === "CANCELED" ||
                          remainingInvites === 0 ||
                          session.user.type === "SELLER"
                        }
                      >
                        <User className="mr-2 h-4 w-4" />
                        Agregar invitado
                      </Button>
                    </AddInvitationMethodDialog>
                  </div>
                </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

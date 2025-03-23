"use client";
import { Evento } from "@/types/event";
import { getEventById } from "@/lib/actions";

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

import { datesFormater } from "@/lib/utils";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { InfoTicketTypeCard } from "./info-ticket-type-card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import DashboardHeader from "./dashboard-header";
import { SITE_URL } from "@/lib/constants";
export default function EventDetails({ evento }: { evento: Evento }) {
  const [activeTab, setActiveTab] = useState("overview");
  const groupedDates = datesFormater(evento.dates as string);

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
            <Button variant="outline" size="sm">
              <Link
                href={`/dashboard/evento/${evento.id}/edit`}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="mr-2 h-4 w-4" />
              Cancelar Evento
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-5 space-y-6">
            <Card>
              <div className="relative h-[300px] w-full">
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
            <Tabs
              defaultValue="overview"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Detalles</TabsTrigger>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="validators">Validadores</TabsTrigger>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Ventas</CardTitle>
                    <CardDescription>
                      Venta de tickets a lo largo del tiempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <SalesChart data={event.recentSales} /> */}
                  </CardContent>
                </Card>
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
                {evento.validatorToken?.map((token) => (
                  <span key={token.id}>{token.token}</span>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vendidas</span>
                    <span>100 / 1200</span>
                  </div>
                  {/* <Progress value={soldPercentage} className="h-2" /> */}
                  <p className="text-xs text-muted-foreground">
                    90% de tickets vendidos
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Ganancia</h4>
                  <p className="text-2xl font-bold">$200000</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Acciones Rápidas</h4>
                  <div className="grid gap-2">
                    <Button size="sm">
                      <Ticket className="mr-2 h-4 w-4" />
                      Vender entrada
                    </Button>
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Agregar invitado
                    </Button>
                    {/* <Button variant="outline" size="sm">
                      <Link
                        href={`/dashboard/evento/${evento.id}/validadores`}
                        className="flex items-center"
                      >
                        <KeyIcon className="mr-2 w-4 h-4" />
                        <span>Validadores</span>
                      </Link>
                    </Button> */}
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

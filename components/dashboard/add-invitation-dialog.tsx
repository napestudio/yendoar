"use client";

import type React from "react";
import { useState } from "react";
import { Session } from "next-auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { InvitationMethodInput, inviteUserToEvent } from "@/lib/actions";

import { Evento } from "@/types/event";
import { toast } from "../ui/use-toast";

const invitationMethodSchema = z.object({
  email: z.string().email().min(5, { message: "Debe ser un email válido" }),
  quantity: z
    .number({ required_error: "Por favor seleccioná la cantidad de entradas" })
    .nonnegative(),
  name: z.string().min(2, { message: "Debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "Debe tener al menos 2 caracteres" }),
  ticketType: z.string({
    required_error: "Por favor seleccioná un tipo de entrada",
  }),
  dni: z.string().min(1, "Este campo es obligatorio"),
});

type InvitationMethodForm = z.infer<typeof invitationMethodSchema>;

interface AddInvitationMethodDialogProps {
  children: React.ReactNode;
  evento?: Evento;
  remainingInvites: number;
}

export function AddInvitationDialog({
  children,
  evento,
  remainingInvites,
}: AddInvitationMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvitationMethodForm>({
    resolver: zodResolver(invitationMethodSchema),
    defaultValues: {
      email: "",
      name: "",
      lastName: "",
      dni: "",
      quantity: 0,
      ticketType: "",
    },
  });

  const { watch, setValue } = form;
  //const selectedMethod = watch("type");

  const onSubmit = async (data: InvitationMethodForm) => {
    setIsSubmitting(true);
    try {
      const payload: InvitationMethodInput = {
        quantity: data.quantity,
        email: data.email,
        ticketTypeId: data.ticketType,
        isInvitation: true,
        status: "PAID",
        eventId: evento?.id,
        name: data.name,
        lastName: data.lastName,
        dni: data.dni,
        totalPrice: 0,
      };

      if (remainingInvites < data.quantity) {
        toast({
          description: `Solo quedan ${remainingInvites} invitaciones disponibles`,
          variant: "destructive",
        });
        return;
      }
      await inviteUserToEvent(payload);
    } catch (error) {
      console.error("Error creando método de pago", error);
    } finally {
      setIsSubmitting(false);
    }
    form.reset();
    setOpen(false);
    await new Promise((r) => setTimeout(r, 1000));

    setIsSubmitting(false);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
            autoComplete="false"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Crear invitación</DialogTitle>
              <DialogDescription>
                Enviar una invitación para el evento {evento?.title}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6 overflow-y-auto pr-1">
              <Card>
                <CardContent className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del invitado</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido del invitado</FormLabel>
                        <FormControl>
                          <Input placeholder="Perez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI del invitado</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email del invitado</FormLabel>
                        <FormControl>
                          <Input placeholder="invitado@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de entradas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ticketType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipos de entradas</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo de entrada" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {evento?.ticketTypes?.map((ticket, i) => (
                              <SelectItem key={i} value={ticket?.id!}>
                                {ticket?.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex-shrink-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar invitación"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

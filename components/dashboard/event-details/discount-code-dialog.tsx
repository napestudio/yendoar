"use client";

import type React from "react";
import Link from "next/link";

import { useEffect, useState } from "react";
import {
  Loader2,
  CreditCard,
  Wallet,
  BanknoteIcon as Bank,
  Landmark,
  DollarSign,
  CalendarIcon,
} from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { User } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Session } from "next-auth";
import { createDiscountCode, createPaymentMethod } from "@/lib/actions";
import { PaymentType } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Evento } from "@/types/event";
import { DiscountCode } from "@/types/discount-code";

const formSchema = z.object({
  code: z.string().min(5, {
    message: "El codigo debe tener al menos 5 caracteres.",
  }),
  eventId: z.string(),
  expiresAt: z.date(),
  discount: z.number(),
  status: z.enum(["DRAFT", "ACTIVE", "CANCELED", "CONCLUDED", "DELETED"]),
  //.refine((file) => file?.length == 1, "File is required."),
});

interface DiscountCodeDialogProps {
  children: React.ReactNode;
  evento: Evento;
  code?: DiscountCode;
}

export function DiscountCodeDialog({
  children,
  evento,
  code,
}: DiscountCodeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: code?.code || "",
      eventId: code?.eventId || "",
      discount: code?.discount || 0,
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (code) {
      form.reset();
    }
  }, [code, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    createDiscountCode({
      code: values.code,
      expiresAt: new Date(values.expiresAt),
      status: "ACTIVE",
      discount: values.discount,
      eventId: evento.id,
    })
      .then(() => {
        form.reset();
        setIsLoading(false);
        toast({
          title: "Código creado!",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "error creando código",
        });
        setIsLoading(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="text-left">
          <DialogTitle>Agregar Código de Descuento</DialogTitle>
          <DialogDescription>
            Agregar un código de descuento para este evento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values: any) => onSubmit(values))}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="NUEVOCODIGO123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento del</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Porcentaje de descuento"
                      max={100}
                      maxLength={3}
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-[240px] pl-3 text-left font-normal")}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Vencimiento</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar codigo"
              )}
            </Button>

            {code && (
              <Button variant="destructive" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar codigo"
                )}
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

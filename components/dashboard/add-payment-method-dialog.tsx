"use client";

import type React from "react";

import { useState } from "react";
import {
  Loader2,
  CreditCard,
  Wallet,
  BanknoteIcon as Bank,
  Landmark,
  DollarSign,
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

interface AddPaymentMethodDialogProps {
  children: React.ReactNode;
  sellers?: User[];
}

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
} from "../ui/form";
import { User } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const paymentMethodSchema = z.object({
  type: z.enum(["mercadopago", "cash"], {
    required_error: "Seleccioná un método de pago",
  }),
  accountName: z.string().min(1, "Este campo es obligatorio"),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  enabled: z.boolean().default(true),
  seller: z.string(),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

export function AddPaymentMethodDialog({
  children,
  sellers,
}: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [accountName, setAccountName] = useState("");
  const [enableIntegration, setEnableIntegration] = useState(true);

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "mercadopago",
      accountName: "",
      apiKey: "",
      secretKey: "",
      enabled: true,
      seller: "",
    },
  });

  const { watch, setValue } = form;
  const selectedMethod = watch("type");

  const onSubmit = async (data: PaymentMethodForm) => {
    setIsSubmitting(true);

    console.log("Submit data", data);

    // Simulación de creación
    await new Promise((r) => setTimeout(r, 1000));

    setIsSubmitting(false);
    setOpen(false);
    form.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Adding payment method:", {
      type: selectedMethod,
      apiKey,
      secretKey,
      accountName,
      enableIntegration,
    });

    setIsSubmitting(false);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    // setSelectedMethod(null);
    setApiKey("");
    setSecretKey("");
    setAccountName("");
    setEnableIntegration(true);
  };

  const paymentOptions = [
    {
      id: "mercadopago",
      name: "MercadoPago",
      description: "Usando MercadoPago Checkout Pro",
      icon: <Wallet className="h-6 w-6" />,
    },
    // {
    //   id: "bank",
    //   name: "Bank Transfer",
    //   description: "Direct bank account transfers",
    //   icon: <Bank className="h-6 w-6" />,
    // },
    {
      id: "cash",
      name: "Efectivo | Punto de venta",
      description: "Para cobros en efectivo",
      icon: <DollarSign className="h-6 w-6" />,
    },
    // {
    //   id: "other",
    //   name: "Other Payment Method",
    //   description: "Custom payment integration",
    //   icon: <Landmark className="h-6 w-6" />,
    // },
  ];

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
              <DialogTitle>Agregar Método de Pago</DialogTitle>
              <DialogDescription>
                Agregar un método de pago para los eventos
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6 overflow-y-auto pr-1">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">
                      Seleccionar tipo
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-4 mt-3"
                      >
                        {paymentOptions.map((option) => (
                          <div key={option.id} className="space-y-0">
                            <FormItem className="flex items-center space-x-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={option.id}
                                  id={option.id}
                                  className="sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={option.id}
                                className="flex items-center justify-between w-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="rounded-full bg-muted p-2 text-primary">
                                    {option.icon}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                      {option.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedMethod && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración</CardTitle>
                    <CardDescription>
                      Ingresa los campos requeridos para crear un nuevo método
                      de pago.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la cuenta</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a name for this account"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Este nombre se utiliza para identificar la cuenta.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedMethod === "cash" && (
                      <>
                        {sellers && (
                          <FormField
                            control={form.control}
                            name="seller"
                            render={({ field }) => (
                              <FormItem>
                                <Select>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar vendedor" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {sellers?.map((seller) => (
                                      <SelectItem
                                        key={seller.id}
                                        value={seller.id || ""}
                                      >
                                        {seller.email}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}

                    {selectedMethod !== "cash" && (
                      <>
                        <FormField
                          control={form.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key / Client ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your API key or client ID"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                La api key de MercadoPago (Cambiar texto)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="secretKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secret Key</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your secret key"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Tu clave secreta.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Habilitado</FormLabel>
                            <FormDescription>
                              Una vez habilitado, este método de pago estará
                              disponible para su uso en la plataforma.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter className="flex-shrink-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || (selectedMethod === "cash" && !sellers)
                }
              >
                {isSubmitting ? "Agregando..." : "Agregar Método"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

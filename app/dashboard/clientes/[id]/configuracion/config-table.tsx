"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Percent, PercentCircle } from "lucide-react";
import { updateUserConfiguration } from "@/lib/actions";
import { useState } from "react";
import { UserConfiguration } from "@/types/user-configuration";

const FormSchema = z.object({
  serviceCharge: z.number(),
  invitesAmount: z.number(),
  validatorsAmount: z.number(),
});

export default function ClientConfigTable({
  config,
  userId,
}: {
  config: UserConfiguration[];
  userId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serviceCharge: config[0].serviceCharge || 0,
      invitesAmount: config[0].maxInvitesAmount || 0,
      validatorsAmount: config[0].maxValidatorsAmount || 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateUserConfiguration(
      {
        serviceCharge: data.serviceCharge,
        maxInvitesAmount: data.invitesAmount,
        maxValidatorsAmount: data.validatorsAmount,
      },
      config[0].id,
      userId
    )
      .then(() => {
        setIsLoading(false);
        toast({
          title: "Configuración actualizada!",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error actualizando",
        });
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="serviceCharge"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Charge</FormLabel>
              <FormControl>
                <div className="relative">
                  <PercentCircle className="absolute right-3 h-5 w-5 top-3" />
                  <Input
                    placeholder="0"
                    maxLength={3}
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Es el porcentaje por entrada que se le cobra al cliente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="invitesAmount"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitaciones por evento</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="0"
                    maxLength={3}
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Cantidad de entradas sin cargo máximas por evento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          disabled={isLoading}
          name="validatorsAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validadores por evento</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    maxLength={3}
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Cantidad de validadores disponibles por evento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" disabled={isLoading}>
          Guardar
        </Button>
      </form>
    </Form>
  );
}

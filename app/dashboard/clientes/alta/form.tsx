"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserInvitation, updateEvent } from "@/lib/actions";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, TicketIcon } from "lucide-react";

import { addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { UserInvitation } from "@/types/user-invitations";

const formSchema = z.object({
  email: z.string().email().min(5, { message: "Debe ser un email válido" }),
});

export default function NewClientForm({
  userId,
  invitations,
}: {
  userId: string;
  invitations: UserInvitation[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const emailExists = invitations.some(
      (invitation) => invitation.email === values.email
    );

    if (emailExists) {
      toast({
        variant: "destructive",
        title: "Error en la invitación",
        description: "El email ya ha sido invitado anteriormente.",
      });
      form.reset();
      setIsLoading(false);
      return;
    }

    const timeZone = "America/Argentina/Buenos_Aires";
    const today = toZonedTime(new Date(), timeZone);
    const tomorrow = addDays(today, 1);
    createUserInvitation({
      email: values.email,
      token: uuidv4(),
      inviterId: userId,
      createdAt: today,
      expiresAt: tomorrow,
    })
      .then(() => {
        toast({
          title: "Usuario invitado!",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error en la invitación",
        });
        setIsLoading(false);
      });
    form.reset();
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail del cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar invitación"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
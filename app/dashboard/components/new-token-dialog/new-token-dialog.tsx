"use client";

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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { createValidatorToken } from "@/lib/actions";
import { Dices } from "lucide-react";
import { useEffect, useState } from "react";

function generateRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@!";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default function NewTokenDialog({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [randomCode, setRandomCode] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    setRandomCode(generateRandomCode());
  }, []);

  function onSubmit() {
    try {
      createValidatorToken({
        token: randomCode,
        eventId,
      });
      toast({
        title: "Token de validación creado",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creando el Token de validación",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Nuevo Token</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo token</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="text-2xl md:text-5xl font-bold">{randomCode}</div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setRandomCode(generateRandomCode())}
          >
            <Dices />
          </Button>
        </div>
        <Separator />
        <DialogFooter>
          <Button type="submit" className="w-full" onClick={() => onSubmit()}>
            Crear Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateEvent } from "@/lib/actions";
import { useState } from "react";
import Autocomplete from "react-google-autocomplete";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatesPicker from "@/components/dates-picker/dates-picker";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Evento } from "@/types/event";
import { cn, useUploadThing } from "@/lib/utils";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FileUploader } from "@/app/dashboard/components/file-uploader/file-uploader";
import { Loader2, TicketIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Box from "./box";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "El titulo debe tener al menos 5 caracteres.",
  }),
  description: z.string(),
  location: z.string(),
  address: z.string(),
  image: z.string(),
  file: z.any(),
});

export default function EditEventForm({ evento }: { evento: Evento }) {
  const parsedDates = JSON.parse(evento.dates);
  const [dateTimeSelections, setDateTimeSelections] = useState(parsedDates);
  const [files, setFiles] = useState<File[]>([]);
  const [deleteImageValue, setDeleteImageValue] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const { startUpload } = useUploadThing("profileImage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: evento.title,
      description: evento.description,
      location: evento.location,
      address: evento.address,
      image: evento.image || "",
      file: evento.image || "",
    },
  });

  const handleAddDateTime = () => {
    const newSelection = {
      id: dateTimeSelections.length,
      date: new Date().toISOString().slice(0, 16),
    };
    setDateTimeSelections([...dateTimeSelections, newSelection]);
  };

  const handleRemoveDateTime = (id: number) => {
    setDateTimeSelections(
      dateTimeSelections.filter((selection: any) => selection.id !== id)
    );
  };

  const handleDateChange = (date: string, id: number) => {
    const updatedSelections = dateTimeSelections.map((selection: any) => {
      if (selection.id === id) {
        return { ...selection, date: date };
      }
      return selection;
    });
    setDateTimeSelections(updatedSelections);
  };

  const handleDeleteImage = async (url: string) => {
    try {
      return await fetch("/api/uploadthing", {
        method: "DELETE",
        body: JSON.stringify(url),
      });
    } catch (error) {
      throw new Error("Error eliminando imagen");
    }
  };

  // Encontrar la última fecha seleccionada
  const lastDate = dateTimeSelections.reduce((latest: any, selection: any) => {
    return new Date(selection.date) > new Date(latest.date)
      ? selection
      : latest;
  });

  // Crear endDate con la última fecha seleccionada a las 23:59
  const endDate = new Date(lastDate.date);
  endDate.setHours(23, 59, 0, 0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const parsedDates = JSON.stringify(dateTimeSelections);

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (uploadedImages) {
        handleDeleteImage(evento.image);
        values.image = uploadedImages[0].url;
      }
    }

    if (deleteImageValue) {
      values.image = "";
    }

    updateEvent(
      {
        title: values.title,
        description: values.description,
        location: values.location,
        address: values.address,
        image: values.image || null,
        dates: parsedDates,
        userId: evento.userId,
        endDate: endDate.toISOString(),
        status: "ACTIVE",
      },
      evento.id
    )
      .then(() => {
        toast({
          title: "Evento editado!",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error editando el evento",
        });
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => onSubmit(values))}
          className="space-y-8 w-full"
        >
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <Box>
                <div className="space-y-4">
                  <h2 className="font-bold">Datos del evento</h2>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Titulo</FormLabel>
                        <FormControl>
                          <Input placeholder="Titulo del evento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción del evento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Box>
              <Box>
                <div className="space-y-4">
                  <h2 className="font-bold">Ubicación</h2>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lugar</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ubicación del evento"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Autocomplete
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            apiKey={process.env.GOOGLE_MAPS_API_KEY}
                            onPlaceSelected={(place) =>
                              field.onChange(place.formatted_address)
                            }
                            options={{
                              types: ["geocode"],
                              componentRestrictions: { country: "ar" },
                            }}
                            defaultValue={field.value}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Box>
              <Box>
                <div className="space-y-4">
                  <h2 className="font-bold">Fechas</h2>

                  <DatesPicker
                    dateTimeSelections={dateTimeSelections}
                    onAddDateTime={handleAddDateTime}
                    onRemoveDateTime={handleRemoveDateTime}
                    onDateChange={handleDateChange}
                  />
                </div>
              </Box>
            </div>
            <div>
              <Box>
                <div className="space-y-4">
                  <h2 className="font-bold">Imagen del evento</h2>

                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            onFieldChange={field.onChange}
                            imageUrl={field.value}
                            setFiles={setFiles}
                            setDeleteImageValue={setDeleteImageValue}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Box>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

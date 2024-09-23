import { Metadata } from "next";
import ValidatorsPageHandler from "./handler";
import { getSoldTicketsByType } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Panel de validación",
  description: "Plataforma de venta de entradas online",
};

export default async function ValidatorPage({
  params,
}: {
  params: { eventId: string };
}) {
  const soldTickets = await getSoldTicketsByType(params.eventId);
  return (
    <div className="w-full bg-white">
      <div className="w-[550px] max-w-[95vw] mx-auto">
        <ValidatorsPageHandler eventId={params.eventId} />;
      </div>
    </div>
  );
}

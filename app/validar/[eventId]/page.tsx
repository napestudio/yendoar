import { Metadata } from "next";
import ValidatorsPageHandler from "./handler";

export const metadata: Metadata = {
  title: "Panel de validación",
  description: "Plataforma de venta de entradas online",
};

export default async function ValidatorPage({
  params,
}: {
  params: { eventId: string };
}) {
  return (
    <div className="w-full">
      <ValidatorsPageHandler eventId={params.eventId} />;
    </div>
  );
}

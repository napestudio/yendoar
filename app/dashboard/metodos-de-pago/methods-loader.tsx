import Box from "@/components/dashboard/box";
import PaymentMethodsTable from "@/components/dashboard/payment-methods-table";
import { getPaymentMethodsByClientId, getUsersByType } from "@/lib/actions";

export default async function PaymentMethodsLoader({
  eventId,
  clientId,
}: {
  eventId?: string;
  clientId: string;
}) {
  const sellers = await getUsersByType(clientId, "SELLER");
  const methods = await getPaymentMethodsByClientId(clientId);
  if (!methods || methods.length === 0) {
    <Box>No hay Métodos de Pago creados</Box>;
  }
  return (
    <PaymentMethodsTable
      methods={methods}
      eventId={eventId}
      sellers={sellers}
    />
  );
}

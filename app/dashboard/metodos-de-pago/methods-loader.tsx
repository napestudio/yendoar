import Box from "@/components/dashboard/box";
import { PaymentMethodsTable } from "@/components/dashboard/payment-methods-table";
import { getPaymentMethodsByClientId } from "@/lib/actions";

export default async function PaymentMethodsLoader({
  clientId,
}: {
  clientId: string;
}) {
  const methods = await getPaymentMethodsByClientId(clientId);
  if (!methods || methods.length === 0) {
    <Box>No hay Métodos de Pago creados</Box>;
  }
  return <PaymentMethodsTable methods={methods} />;
}

import mpApi, { mercadopago } from "@/lib/api/mercadopago";
import { Payment } from "mercadopago";

export async function POST(req: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = await req.json();

  // Obtenemos el pago
  const payment = await new Payment(mercadopago).get({ id: body.data.id });

  console.log(payment);

  if (payment.status === "approved") {
    // ACTUALIZA LA ORDEN
    // LOS DATOS DE LA ORDEN VIENEN EN metadata.order_id
  }
  return new Response(null, { status: 200 });
}

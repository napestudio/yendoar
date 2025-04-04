import {
  getDigitalPaymentMethodKeyByEvent,
  getMercadoPagoTokenByUser,
  payOrderHandler,
} from "@/lib/actions";
import MercadoPagoConfig, { Payment } from "mercadopago";

export async function POST(req: Request) {
  const res = await req.json();
  console.log(res);
  const topic = res.topic || res.type;
  // Algunas veces el topic es payment pero la respuesta no trae el objeto data.
  // Si esto es asi, no lo dejamos pasar
  if (topic !== "payment" || !res.data) {
    return new Response(null, { status: 200 });
  }

  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = res;
  const { searchParams } = new URL(req.url);
  // Obtenemos el id del evento de la URL
  const eventId = searchParams.get("e");
  console.log("eventId", eventId);
  if (eventId) {
    // Obtenemos el token del método de pago
    const paymentMethod = await getDigitalPaymentMethodKeyByEvent(eventId);
    const mpToken = paymentMethod[0].paymentMethod.apiKey;
    if (mpToken) {
      const mp = new MercadoPagoConfig({
        accessToken: mpToken,
      });
      // Obtenemos el pago
      const payment = await new Payment(mp).get({ id: body.data.id });
      console.log("payment", payment);
      if (payment.status === "approved") {
        await payOrderHandler(payment.metadata.order_id);
      }
    }
  }

  return new Response(null, { status: 200 });
}

import { getMercadoPagoTokenByUser, payOrderHandler } from "@/lib/actions";
import MercadoPagoConfig, { Payment } from "mercadopago";

export async function POST(req: Request) {
  const res = await req.json();
  const topic = res.topic || res.type;
  console.log("🚀 ~ POST ~ topic:", topic)
  // Algunas veces el topic es payment pero la respuesta no trae el objeto data.
  // Si esto es asi, no lo dejamos pasar
  if (topic !== "payment" || !res.data) {
    return new Response(null, { status: 200 });
  }

  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = res;
  console.log("🚀 ~ POST ~ body:", body)
  const { searchParams } = new URL(req.url);
  console.log("🚀 ~ POST ~ searchParams:", searchParams)
  // Obtenemos el id del usuario de la URL
  const userId = searchParams.get("u");
  console.log("🚀 ~ POST ~ userId:", userId)
  if (userId) {
    // Obtenemos el token del usuario
    const mpToken = await getMercadoPagoTokenByUser(userId);
    console.log("🚀 ~ POST ~ mpToken:", mpToken)
    if (mpToken) {
      const mp = new MercadoPagoConfig({
        accessToken: mpToken,
      });
      // Obtenemos el pago
      const payment = await new Payment(mp).get({ id: body.data.id });
      console.log("🚀 ~ POST ~ payment:", payment)

      if (payment.status === "approved") {
        await payOrderHandler(payment.metadata.order_id);
      }
    }
  }

  return new Response(null, { status: 200 });
}

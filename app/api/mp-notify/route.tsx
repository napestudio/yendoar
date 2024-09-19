import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { payOrderHandler } from "@/lib/actions";

// ESTE TOKEN PUEDE SER EL GLOBAL DE LA MARCA,
// NO NECESITA SER EL DEL USUARIO Y BASICAMENTE
// ACA NO PODEMOS CONSEGUIR EL DEL USUARIO,
// LO USAMOS SOLO PARA VER EL ESTADO DEL PAGO
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-3672614689710911-091713-66f39925b4b509d12c1615a3f21d2b01-1031008335",
});
// PUSE EL TOKEN ACA PORQUE DESDE EL ENV LO ESTABA TOMANDO MAL Y ESO PUEDE SER EL PROBLEMA DEL FALLO

export async function POST(req: NextRequest, res: NextResponse) {
  const r = await req.json();
  const topic = r.topic || r.type;
  try {
    if (topic === "payment") {
      const paymentId = r.data.id;
      console.log("🚀 ~ POST ~ r:", r);
      console.log("🚀 ~ POST ~ r:", client);

      const payment = await new Payment(client).get({ id: paymentId });

      if (payment) {
        console.log("payment", payment);
      } else {
        console.log("payment error");
      }
      if (payment.status === "approved") {
        let orderId = payment.external_reference;
        await payOrderHandler(orderId!);
        return NextResponse.json({ data: "OK" }, { status: 201 });
      } else {
        // Return a different response if payment status is not approved
        return NextResponse.json(
          { data: "Payment not approved" },
          { status: 400 }
        );
      }
    } else {
      // Return a response when topic is not 'payment'
      return NextResponse.json({ data: "Invalid topic" }, { status: 400 });
    }
  } catch (error) {
    // Return a response when there is an error
    return NextResponse.json({ error });
  }
}

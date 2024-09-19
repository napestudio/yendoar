import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { payOrderHandler } from "@/lib/actions";

// ESTE TOKEN PUEDE SER EL GLOBAL DE LA MARCA,
// NO NECESITA SER EL DEL USUARIO Y BASICAMENTE
// ACA NO PODEMOS CONSEGUIR EL DEL USUARIO,
// LO USAMOS SOLO PARA VER EL ESTADO DEL PAGO
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-3322264706263758-090912-65e5b06899deb5c24feb199fc20da7fd-54797482",
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
      try {
        const payment = await new Payment(client).get({ id: paymentId });
        console.log("🚀 ~ POST ~ payment:", payment);
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
      } catch (error) {
        console.log("payment error", error);
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

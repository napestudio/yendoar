import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getMercadoPagoTokenByUser, payOrderHandler } from "@/lib/actions";

// ESTE TOKEN PUEDE SER EL GLOBAL DE LA MARCA,
// NO NECESITA SER EL DEL USUARIO Y BASICAMENTE
// ACA NO PODEMOS CONSEGUIR EL DEL USUARIO,
// LO USAMOS SOLO PARA VER EL ESTADO DEL PAGO
// const client = new MercadoPagoConfig({
//   accessToken:
//     "APP_USR-7783662794333159-091016-072a36241a8186630dc77a216b492fa5-265508758",
// });
// PUSE EL TOKEN ACA PORQUE DESDE EL ENV LO ESTABA TOMANDO MAL Y ESO PUEDE SER EL PROBLEMA DEL FALLO

export async function POST(req: NextRequest, res: NextResponse) {
  const r = await req.json();
  
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const topic = r.topic || r.type;

  const MP_ACCESS_TOKEN = await getMercadoPagoTokenByUser(userId!);
  console.log("🚀 ~ MP_ACCESS_TOKEN ~ id:", MP_ACCESS_TOKEN)
  const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN!,
  });

  try {
    if (topic === "payment") {
      if (!userId) {
        return NextResponse.json({ msg: "No user id" });
      }    

      const paymentId = r.data.id;
      console.log("🚀 ~ POST ~ client:", client)
      console.log("🚀 ~ POST ~ paymentId:", paymentId)
      const payment = await new Payment(client).get({ id: paymentId });
      console.log("🚀 ~ POST ~ payment:", payment)


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
    console.log("🚀 ~ POST ~ error:", error)
    // Return a response when there is an error
    return NextResponse.json({ error });
  }
}

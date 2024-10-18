import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getMercadoPagoTokenByUser, payOrderHandler } from "@/lib/actions";

export async function POST(req: NextRequest, res: NextResponse) {
  const r = await req.json();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const topic = r.topic || r.type;
  const MP_ACCESS_TOKEN = await getMercadoPagoTokenByUser(userId!);
  try {
    if (topic === "payment") {
      if (!userId) {
        return NextResponse.json({ msg: "No user id" });
      }

      const client = new MercadoPagoConfig({
        accessToken: MP_ACCESS_TOKEN!,
      });

      const paymentId = r.data.id;

      const payment = await new Payment(client).get({ id: paymentId });

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

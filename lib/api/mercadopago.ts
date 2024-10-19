import { MercadoPagoConfig, Preference } from "mercadopago";
import { updateOrder } from "./orders";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const mpApi = {
  order: {
    async createPayment(
      product: any,
      orderData: any,
      orderId: string,
      userId: string
    ) {
      updateOrder(orderId, orderData);
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: orderId,
              title: `${product.title} x${product.quantity}`,
              unit_price: product.price,
              quantity: product.quantity,
            },
          ],
          metadata: {
            orderId: orderId,
          },
        },
      });

      return preference.init_point!;
    },
  },
};

export default mpApi;

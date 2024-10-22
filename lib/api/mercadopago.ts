import { MercadoPagoConfig, Preference } from "mercadopago";
import { updateOrder } from "./orders";
import { getMercadoPagoTokenByUser } from "../actions";

export const mpApi = {
  order: {
    async createPayment(
      product: any,
      orderData: any,
      orderId: string,
      userId: string
    ) {
      const mercadopagoToken = await getMercadoPagoTokenByUser(userId);
      if (mercadopagoToken) {
        console.log(mercadopagoToken);
        const mercadopago = new MercadoPagoConfig({
          accessToken: mercadopagoToken,
        });

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
            back_urls: {
              success: "https://wkrm6zc8-3000.brs.devtunnels.ms",
            },
            notification_url: `https://wkrm6zc8-3000.brs.devtunnels.ms/api/mercadopago/pagos?u=${userId}`,
          },
        });

        return preference.init_point!;
      }
    },
  },
};

export default mpApi;

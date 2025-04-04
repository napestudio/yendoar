"use server";

import * as Eventos from "@/lib/api/eventos";
import * as Orders from "@/lib/api/orders";
import * as TicketTypes from "@/lib/api/ticket-types";
import * as Users from "@/lib/api/users";
import * as Configuration from "@/lib/api/user-configuration";
import * as TicketOrders from "@/lib/api/ticket-orders";
import * as Code from "@/lib/api/descuento-code";
import * as ValidatorToken from "@/lib/api/validators-token";
import * as UserInvitation from "@/lib/api/user-invitations";
import * as PaymentMethod from "@/lib/api/payment-methods";

import { EventStatus } from "@/types/event";
import { Product } from "@/types/product";
import { DatesType, TicketOrderType, TicketType } from "@/types/tickets";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DiscountCode } from "@/types/discount-code";
import { UserInvitation as InvitationType } from "@/types/user-invitations";
import QRCode from "qrcode";
import bcrypt from "bcrypt";
import { sendEmail as sendReset } from "./reset-email";
import { sendEmail as sendQr } from "./send-mail";
import { generatePasswordResetToken } from "./tokens";
import {
  getPasswordResetTokenByToken,
  removePasswordResetTokenById,
} from "./api/reset-password-token";
import { stat } from "fs";
import { SITE_NAME } from "./constants";
import { getPaidOrdersDataByEvent } from "@/lib/api/orders";
import { User, UserType } from "@/types/user";
import { UserConfiguration } from "@/types/user-configuration";

// Type temporal
export type Evento = {
  title: string;
  description: string;
  address: string;
  location: string;
  userId: string;
  image: string | null;
  dates: string;
  status: EventStatus;
  endDate: string;
};

export async function createEvent(data: Evento) {
  let eventId = null;
  try {
    const result = await Eventos.createEvent(data);

    eventId = result.id;
  } catch (error) {
    throw new Error("Error creando el evento");
  }
  if (eventId) {
    redirect(`/dashboard/evento/${eventId}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
}

export async function updateEvent(data: Evento, eventId: string) {
  try {
    const result = await Eventos.updateEvent(eventId, data);
    revalidatePath(`/dashboard/evento/${result.id}`);
    revalidatePath(`/eventos/${result.id}`);
    revalidatePath(`/`);
  } catch (error) {
    throw new Error("Error editando el evento");
  }
}

export async function cancelEvent(eventId: string) {
  const data = { status: "CANCELED" };
  try {
    const result = await Eventos.updateEvent(eventId, data as Evento);
    revalidatePath(`/dashboard/evento/${result.id}`);
  } catch (error) {
    throw new Error("Error cancelando el evento");
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const data = { status: "DELETED" };
    const result = await Eventos.updateEvent(eventId, data as Evento);

    revalidatePath(`/dashboard`);
    return result;
  } catch (error) {
    throw new Error("Error editando el evento");
  }
}

export async function getEventById(eventId: string) {
  try {
    const result = await Eventos.getEventById(eventId);
    return result;
  } catch (error) {
    throw new Error("Error");
  }
}

export async function getEventIdByToken(token: string) {
  try {
    const result = await ValidatorToken.getEventByToken(token);
    return result;
  } catch (error) {
    throw new Error("Error");
  }
}

export async function getOrdersByEvent(eventId: string) {
  try {
    const result = await Orders.getOrdersByEvent(eventId);
    return result;
  } catch (error) {
    throw new Error("Error");
  }
}

export async function getOrderTicketsByEvent(eventId: string) {
  try {
    const result = await TicketOrders.getOrderTicketsByEvent(eventId);
    return result;
  } catch (error) {
    throw new Error("Error GET order tickets");
  }
}
export async function getTicketOrdersByEventId(eventId: string) {
  try {
    const result = await TicketOrders.getTicketOrdersByEventId(eventId);
    const response = {
      evento: {
        title: result[0].event.title,
      },
      result,
    };
    return response;
  } catch (error) {
    throw new Error("Error GET order tickets");
  }
}

export async function getTicketTypesByEventId(eventId: string) {
  try {
    const result = await TicketTypes.getTicketTypesByEventId(eventId);
    return result;
  } catch (error) {
    throw new Error("Error en getTicketTypesByEventId");
  }
}

export async function getTyicketTypeById(ticketTypeId: string) {
  try {
    const result = await TicketTypes.getTicketTypesById(ticketTypeId);
    return result;
  } catch (error) {
    throw new Error("Error en getTicketTypesByEventId");
  }
}

export async function createTicketType(data: TicketType) {
  try {
    const result = await TicketTypes.createTicketType(data);
  } catch (error) {
    throw new Error("Error creando el TicketType");
  }

  revalidatePath(`/dashboard/evento/${data.eventId}/edit`);
}

export async function updateTicketType(
  data: Partial<TicketType>,
  ticketId: string
) {
  try {
    const result = await TicketTypes.updateTicketType(ticketId, data);
    revalidatePath(`/dashboard/evento/${data.eventId}`);
  } catch (error) {
    throw new Error("Error editando el tipo de ticket");
  }
}

export type CreateOrderType = {
  ticketTypeId: string;
  status: string;
  quantity: number;
  eventId: string;
  hasCode: boolean;
  discountCode: string | undefined;
};

export async function createOrder(data: CreateOrderType) {
  let orderId = null;
  try {
    const result = await Orders.createOrder(data);
    orderId = result.id;
  } catch (error) {
    throw new Error("Error creando la order");
  }
  if (orderId) {
    redirect(`/orders/${orderId}`);
  }

  revalidatePath("/dashboard");
}

export async function createCashOrder(data: CreateOrderType) {
  try {
    const result = await Orders.createOrder(data);
    if (result) {
      const dates = JSON.parse(result.ticketType.dates!);
      const is2x1 = result.ticketType.buyGet === 2;
      result.quantity = is2x1 ? result.quantity * 2 : result.quantity;

      const ticketsData: TicketOrderType[] = [];
      dates.forEach((dateObj: DatesType) => {
        for (let i = 0; i < result.quantity; i++) {
          ticketsData.push({
            name: result.name!,
            lastName: result.lastName!,
            dni: result.dni!,
            email: result.email!,
            base64Qr: "code",
            date: new Date(dateObj.date),
            orderId: result.id,
            eventId: result.eventId,
            status: "NOT_VALIDATED",
          });
        }
      });
      await createTicketOrder(ticketsData);
    }
  } catch (error) {
    throw new Error("Error creando la order");
  }
}

export async function getOrderById(orderId: string) {
  try {
    return await Orders.getOrderById(orderId);
  } catch (error) {
    throw new Error("Error get order by id");
  }
}

export async function updateOrder(data: any, orderId: string) {
  try {
    const result = await Orders.updateOrder(orderId, data);
    revalidatePath(`/orders/${result.id}`);
  } catch (error) {
    throw new Error("Error editando la order");
  }
}

export async function getAllUsersByClientId(clientId: string) {
  try {
    const result = await Users.getUsersByClientId(clientId);
    return result;
  } catch (error) {}
}

export async function getUsersByType(clientId: string, type: UserType) {
  try {
    const result = await Users.getUsersByType(clientId, type);
    return result;
  } catch (error) {
    throw new Error("Error trayendo usuarios por type");
  }
}

export async function getAllUsersButAdmins() {
  try {
    const result = await Users.getAllUsersButAdmins();
    return result;
  } catch (error) {}
}

export async function updateUser(data: any, userEmail: string) {
  try {
    const result = await Users.updateUser(data, userEmail);
    revalidatePath(`/dashboard/evento/${result.id}`);
  } catch (error) {
    throw new Error("Error editando el usuario");
  }
}

export async function updateUserById(data: Partial<User>, userId: string) {
  try {
    const result = await Users.updateUserById(data, userId);
    revalidatePath(`/dashboard/usuarios/`);
    return result;
  } catch (error) {
    throw new Error("Error editando el usuario");
  }
}

export async function deleteUser(userId: string, userEmail: string) {
  try {
    const result = await Users.deleteUser(userId, userEmail);

    revalidatePath(`/dashboard/usuarios`);
    return result;
  } catch (error) {
    throw new Error("Error eliminando el usuario");
  }
}

type PaymentMethodInput = {
  name?: string;
  type: "CASH" | "DIGITAL";
  clientId: string;
  userId?: string;
};

export async function createPaymentMethod(data: PaymentMethodInput) {
  const { type, userId } = data;
  if (type === "CASH" && !userId) {
    throw new Error("CASH tiene que contener un userId");
  }
  try {
    const method = await PaymentMethod.createPaymentMethod(data);
    revalidatePath("/dashboard/payment-methods");
    return method;
  } catch (error) {
    throw new Error(`Error creando Metodo de Pago: ${error}`);
  }
}
export async function updatePaymentMethod(data: any, paymentMethodId: string) {
  const { type, userId } = data;

  if (type === "CASH" && !userId) {
    throw new Error("CASH tiene que contener un userId");
  }
  try {
    const method = await PaymentMethod.updatePaymentMethod(
      data,
      paymentMethodId
    );
    revalidatePath("/dashboard/payment-methods");
    return method;
  } catch (error) {
    throw new Error(`Error creando Metodo de Pago: ${error}`);
  }
}

export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    const result = await PaymentMethod.deletePaymentMethodAction(
      paymentMethodId
    );

    revalidatePath(`/dashboard/metodos-de-pago`);
    return result;
  } catch (error) {
    throw new Error("Error eliminando metodo de pago");
  }
}

type AssignPaymentMethodsInput = {
  eventId: string;
  paymentMethodIds: string[];
};

export async function assignPaymentMethodsToEvent({
  eventId,
  paymentMethodIds,
}: AssignPaymentMethodsInput) {
  try {
    const result = await PaymentMethod.assignPaymentMethodsToEvent({
      eventId,
      paymentMethodIds,
    });
    return result;
  } catch (error) {
    throw new Error("Error asignando método de pago");
  }
}

type UnassignInput = {
  eventId: string;
  paymentMethodId: string;
};

export async function unassignPaymentMethodFromEvent({
  eventId,
  paymentMethodId,
}: UnassignInput) {
  try {
    const methods = await PaymentMethod.unassignPaymentMethodFromEvent({
      eventId,
      paymentMethodId,
    });
    return methods;
  } catch (error) {
    throw new Error("Error quitando método de pago");
  }
}

export async function getPaymentMethodsByClientId(clientId: string) {
  try {
    const methods = await PaymentMethod.getPaymentMethodsByClientId(clientId);
    return methods;
  } catch (error) {
    throw new Error("Error buscando metodos de pago por clientId");
  }
}

export async function getPaymentMethodsByCreatorId(creatorId: string) {
  try {
    const methods = await PaymentMethod.getPaymentMethodsByCreatorId(creatorId);
    return methods;
  } catch (error) {
    throw new Error("Error buscando metodos de pago por creatorId");
  }
}

export async function getMercadoPagoTokenByUser(userId: string) {
  try {
    const result = await Configuration.getAllUserConfiguration(userId);
    return result[0].mpAccessToken;
  } catch (error) {
    throw new Error("Error get mercadoPagoTokenByUser");
  }
}

export async function getDigitalPaymentMethodKeyByEvent(eventId: string) {
  try {
    const result = await PaymentMethod.getDigitalPaymentMethodByEvent(eventId);
    return result;
  } catch (error) {
    throw new Error("Error get mercadoPagoTokenByUser");
  }
}

export async function getMercadPagoUrl(
  product: any,
  orderData: any,
  orderId: string,
  userId: string
) {
  // Cambiar type de product y ademas pedir la data del form para updatear la order
  updateOrder(orderData, orderId);
  let preference = null;
  const MP_ACCESS_TOKEN = await getMercadoPagoTokenByUser(userId);
  const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN!,
  });

  const siteUrl = process.env.MP_SITE_URL;
  try {
    preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: `${product.title}-${Math.floor(Math.random() * 100000)}`,
            title: `${product.title} x${product.quantity}`,
            unit_price: product.price * product.quantity,
            quantity: 1,
          },
        ],
        external_reference: orderId,
        auto_return: "approved",
        back_urls: {
          success: `${siteUrl}/`,
          failure: `${siteUrl}/`,
        },
        notification_url: `${siteUrl}/api/mp-notify?user_id=${userId}`,
      },
    });
  } catch (error) {
    throw new Error("Error MercadoPago");
  }
  if (preference) {
    // if (process.env.NODE_ENV === "production") {
    redirect(preference.init_point!);
    // } else {
    // redirect(preference.sandbox_init_point!);
    // }
  }
}

export async function payOrderHandler(orderId: string) {
  try {
    const order = await getOrderById(orderId);

    if (!order || order.status === "PAID") return;

    const dates = JSON.parse(order.ticketType.dates!);
    const is2x1 = order.ticketType.buyGet === 2;
    order.quantity = is2x1 ? order.quantity * 2 : order.quantity;

    await updateOrder(
      {
        status: "PAID",
      },
      orderId
    );

    const ticketsData: TicketOrderType[] = [];
    dates.forEach((dateObj: DatesType) => {
      for (let i = 0; i < order.quantity; i++) {
        ticketsData.push({
          name: order.name!,
          lastName: order.lastName!,
          dni: order.dni!,
          email: order.email!,
          base64Qr: "code",
          date: new Date(dateObj.date),
          orderId: orderId,
          eventId: order.event.id,
          status: "NOT_VALIDATED",
        });
      }
    });

    await createTicketOrder(ticketsData);
  } catch (error) {
    throw new Error("Error creando free ticket");
  }
}

export async function createFreeTicket(
  orderData: any,
  orderId: string,
  userId: string
) {
  try {
    updateOrder(orderData, orderId);
    payOrderHandler(orderId);
  } catch (error) {
    throw new Error("Error creando free ticket");
  }
}

export async function createTicketOrder(tickets: TicketOrderType[]) {
  try {
    const result = await TicketOrders.createTicketOrder(tickets);

    if (result.length > 0) {
      await sendTicketMail(result as TicketOrderType[]);
    }
  } catch (error) {
    throw new Error("Error tickets");
  }
}

export async function sendTicketMail(tickets: TicketOrderType[]) {
  const qrTickets: any[] = [];
  const eventData = await Eventos.getEventById(tickets[0].eventId!);

  for (let ticket of tickets) {
    const base64Url = await setQrCode(ticket.id);
    const newTicket: any = {
      ...ticket,
      path: base64Url,
    };
    qrTickets.push(newTicket);
  }

  const emailSubject = `Gracias por comprar en ${SITE_NAME}`;
  const emailBody = `  
  <div
      style="
        font-family: Inter, Helvetica, sans-serif;
        background-color: #016fd0;
        padding: 20px;
        margin: 0;
      "
    >
      <div style="text-align: center; margin-bottom: 1rem">
        <img
          style="width: 10rem"
          src="data:image/png;base64,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"
        />
      </div>
      <div
        style="
          max-width: 1400px;
          margin: 0 auto;
          background-color: #ffffff;
          overflow: hidden;
          border: 4px solid black;
          border-radius: 0.5rem;
        "
      >
        <div
          style="
            background-color: white;
            padding: 20px;
            text-align: center;
            color: black;
          "
        >
          <h1 style="text-transform: uppercase; color: black; margin: 0">
            <span style="font-weight: 800">¡Hola! </span>
            <span style="font-weight: 400">Estas son tus entradas para ${
              eventData?.title
            }</span>
          </h1>
        </div>
        <div style="padding: 20px; text-align: center">
          <div style="display: block;margin: 0 auto;">
            ${qrTickets
              .map(
                (t, i) => `
            <div
              class="box"
              style="
                border: 1px solid #e2e8f0;
                min-width: 19rem;
                text-align: left;
                margin-bottom: 1rem;
              "
            >
              <div style="display:flex;gap:10px;">
                <div style="width:75%;padding:1rem">
                  <p style="font-size: 14px; color: black; margin: 0px">
                    N.:${String(t.code).padStart(5, "0")}
                  </p>
                  <h3 style="font-size: 1.5rem; color: black; margin: 0px">
                    ${eventData?.title}
                  </h3>
                  <p style="font-size: 14px; color: black; margin: 0px">
                    Lugar: <span style="font-weight:600;">${
                      eventData?.location
                    }</span>
                  </p>
                  <p style="font-size: 14px; color: black; margin: 0px">
                    Dirección: <span style="font-weight:600;">${
                      eventData?.address
                    }</span>
                  </p>
                  <p style="font-size: 14px; color: black; margin: 0px">
                    Fecha: <span style="font-weight:600;">${new Date(
                      t.date
                    ).getDate()}/${new Date(t.date).getMonth() + 1}/${new Date(
                  t.date
                ).getFullYear()} - ${new Date(t.date)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${new Date(t.date)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}hs</span>
                  </p>
                </div>
                <div style="border-left:1px dashed #e2e8f0;width:25%;text-align:center; overflow: hidden">
                  <img style="width:100%;height:100%;" alt="${
                    eventData?.title
                  }" src="${t.path}" />
                </div>
              </div>
            </div>
            `
              )
              .join("")}
          </div>
          <p style="font-size: 1.1rem; line-height: 1.5; color: #222222;">Recordá llevar tu dni. ¡Nos vemos ahí!.</p>
            <p style="font-size: 1.1rem; line-height: 1.5; color: #222222;">
              <a href="${process.env.BASE_URL}terminos-y-condiciones" style="color: #0f172a; text-decoration: underline;">Términos y Condiciones de Uso</a>.
            </p>
        </div>
      </div>
    </div>
  `;

  await sendQr(qrTickets[0].email, emailSubject, emailBody, qrTickets);
}

export async function setQrCode(ticketId = "") {
  try {
    // Generate the QR code
    return await QRCode.toDataURL(`${ticketId}`);
  } catch (err) {
    throw new Error("Error generando codigo QR");
  }
}

export async function validateTicketById(ticketId: string, eventId: string) {
  const status = await TicketOrders.getTicketStatusById(ticketId);
  if (status?.status === "VALIDATED") {
    return false;
  }
  try {
    const result = await TicketOrders.validateTicketById(ticketId, eventId);
    return result;
  } catch (error) {
    throw new Error("Error validando el ticket");
  }
}

export async function invalidateTicketById(ticketId: string) {
  try {
    const result = await TicketOrders.invalidateTicketById(ticketId);
    return result;
  } catch (error) {
    throw new Error("Error invalidando el ticket");
  }
}

export async function getAllUserConfiguration(userId: string) {
  try {
    const result = await Configuration.getAllUserConfiguration(userId);
    return result;
  } catch (error) {
    throw new Error("Error get notificaciones");
  }
}

export async function createUserConfiguration(userId: string) {
  try {
    const result = await Configuration.createUserConfiguration(userId);
    return result;
  } catch (error) {
    throw new Error("Error creando configuracion del usuario");
  }
}

export async function updateUserConfiguration(
  data: Partial<UserConfiguration>,
  configId: string,
  userId: string
) {
  try {
    if (!configId) {
      const resp = await Configuration.createUserConfiguration(userId);
      await Configuration.updateUserConfiguration(data, resp.id);
    } else {
      await Configuration.updateUserConfiguration(data, configId);
    }

    revalidatePath(`/dashboard/configuracion`);
  } catch (error) {
    throw new Error("Error editando la configuracion");
  }
}

export async function getServiceCharge(userId: string) {
  try {
    const result = await Configuration.getAllUserConfiguration(userId);

    return result.length > 0 ? result[0].serviceCharge : 0;
  } catch (error) {
    throw new Error("Error trayendo service charge");
  }
}

export async function createDiscountCode(data: DiscountCode) {
  let codeId = null;
  try {
    const result = await Code.createDiscountCode(data);
    codeId = result.id;
  } catch (error) {
    throw new Error("Error creando el código de descuento");
  }
  if (codeId) {
    redirect(`/dashboard/codigos/${codeId}`);
  }

  revalidatePath("/dashboard");
}

export async function updateDiscountCode(data: DiscountCode, eventId: string) {
  try {
    const result = await Code.updateDiscountCode(eventId, data);
    revalidatePath(`/dashboard/evento/${result.id}`);
  } catch (error) {
    throw new Error("Error editando el evento");
  }
}

export async function deleteDiscountCode(eventId: string) {
  try {
    const data = { status: "DELETED" };
    const result = await Code.updateDiscountCode(eventId, data as DiscountCode);

    revalidatePath(`/dashboard`);
    return result;
  } catch (error) {
    throw new Error("Error editando el evento");
  }
}

export async function getDiscountCodeById(eventId: string) {
  try {
    const result = await Code.getDiscountCodeById(eventId);
    return result;
  } catch (error) {
    throw new Error("Error en getDiscountCodeById");
  }
}

export async function createValidatorToken(data: any) {
  try {
    const result = await ValidatorToken.createValidatorToken(data);
    revalidatePath(`/dashboard/evento/${data.eventId}`);
  } catch (error) {
    throw new Error("Error validators token");
  }
}

export async function getTokensByEvent(eventId: string) {
  try {
    const result = await ValidatorToken.getTokensByEvent(eventId);
    return result;
  } catch (error) {
    throw new Error("Error getTokensByEvent");
  }
}

export async function deleteTokenById(tokenId: string) {
  try {
    const result = await ValidatorToken.deleteTokenById(tokenId);
    revalidatePath(`/dashboard`);
    return result;
  } catch (error) {
    throw new Error("Error eliminando token de validación");
  }
}

export async function createUserInvitation(data: InvitationType) {
  try {
    const result = await UserInvitation.createUserInvitation(data);
    revalidatePath("/dashboard/usuarios");
    return result;
  } catch (error) {
    throw new Error("Error creando la invitación");
  }
}
export async function updateUserInvitationById(
  data: InvitationType,
  invitationId: string
) {
  try {
    const result = await UserInvitation.updateInvitationsById(
      data,
      invitationId
    );
    revalidatePath("/dashboard/usuarios");
    return result;
  } catch (error) {
    throw new Error("Error creando la invitación");
  }
}

export async function removeInvitationById(invitadionId: string) {
  try {
    const result = await UserInvitation.removeInvitationById(invitadionId);
    revalidatePath("/dashboard/usuarios");
    return result;
  } catch (error) {
    throw new Error("Error eliminando la invitación");
  }
}

export async function getInvitationsByUser(userId: string) {
  try {
    const result = await UserInvitation.getInvitationsByUser(userId);
    return result;
  } catch (error) {
    throw new Error("Error trayendo invitations");
  }
}

export async function getPendingInvitationsByUser(userId: string) {
  try {
    const result = await UserInvitation.getPendingInvitationsByUser(userId);
    return result;
  } catch (error) {
    throw new Error("Error trayendo invitations");
  }
}

export async function getInvitationsById(invitationId: string) {
  try {
    const result = await UserInvitation.getInvitationsById(invitationId);
    return result;
  } catch (error) {
    throw new Error("Error getInvitationsById");
  }
}

export async function registerUser(data: any) {
  try {
    let user = null;
    const userData = await Users.getUserByEmailForRegister(data.email);
    if (userData) {
      return true;
    }

    const userInvitation = await UserInvitation.getInvitationsByEmail(
      data.email
    );
    if (!userInvitation) {
      throw new Error("No se ha encontrado una invitación");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const result = await Users.createUser(data);
    user = result.id;
  } catch (error) {
    throw new Error("Error creando el usuario");
  }
}

export async function resetPassword(email: string) {
  try {
    const existingUser = await Users.getUserByEmailForRegister(email);
    if (!existingUser) {
      return { ok: false };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    const emailSubject = `Recuperar contraseña de ${SITE_NAME}`;
    const emailBody = `
    <div
      style="
        font-family: Inter, Helvetica, sans-serif;
        background-color: #016fd0;
        padding: 20px;
        margin: 0;
      "
    >      
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          overflow: hidden;
          border: 4px solid black;
          border-radius: 0.5rem;
        "
      >
        <div
          style="
            background-color: white;
            padding: 20px;
            text-align: center;
            color: black;
          "
        >
          <h1 style="text-transform: uppercase; color: black; margin: 0">
            <span style="font-weight: 800">¡Hola! </span
            ><span style="font-weight: 400">${emailSubject}</span>
          </h1>
        </div>
        <div style="padding: 20px; text-align: center">
          <p style="font-size: 1.2rem; line-height: 1; color: #000000">
            Para reiniciar tu contraseña, hace click en el siguiente enlace.
          </p>
          <a
            href="${process.env.BASE_URL}/ingresar/new-password/${passwordResetToken.token}"
            type="submit"
            style="
              display: inline-block;
              padding: 15px 25px;
              font-size: 16px;
              color: #ffffff;
              background-color: #e65a25;
              text-decoration: none;
              border: 4px solid black;
              box-shadow: 5px 5px 0px 0 black;
              margin-top: 20px;
            "
          >
            Reiniciar contraseña
          </a>
          <p style="font-size: 14px; color: black; margin-top: 20px">
            ¡Gracias!
          </p>
        </div>
      </div>
    </div>
    `;
    await sendReset(passwordResetToken.email, emailSubject, emailBody);
    return { ok: true };
  } catch (error) {
    throw new Error("Error reiniciando contraseña");
  }
}

export async function confirmNewPassword(password: string, token: string) {
  try {
    if (!token) return { ok: false };
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) return { ok: false };
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return { ok: false };
    const existingUser = await Users.getUserByEmail(existingToken.email);
    if (!existingUser) return { ok: false };

    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;

    await Users.updateUser(existingUser, existingUser.email!);
    await removePasswordResetTokenById(existingToken.id);

    return { ok: true };
  } catch (error) {
    throw new Error("Error confirmando nueva contraseña");
  }
}

export async function getTicketAmountByTicketTypeId(ticketTypeId: string) {
  try {
    const result = await TicketOrders.getTicketsByTicketTypeId(ticketTypeId);
    return result.length;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export async function getSoldTicketsByType(eventId: string) {
  try {
    let ticketCounts: Record<
      string,
      { id?: string; title?: string; count?: number }
    > = {};
    const ticketOrders = await getPaidOrdersDataByEvent(eventId);

    ticketOrders.forEach((ticketOrder: any) => {
      if (!ticketCounts[ticketOrder.ticketTypeId]) {
        ticketCounts[ticketOrder.ticketTypeId] = {
          id: ticketOrder.ticketTypeId,
          title: ticketOrder.ticketType.title,
          count: ticketOrder.tickets.length,
        };
      } else {
        ticketCounts[ticketOrder.ticketTypeId].count +=
          ticketOrder.tickets.length;
      }
    });

    return ticketCounts;
  } catch (error) {
    throw new Error("Error trayendo la cantidad de entradas vendidas");
  }
}

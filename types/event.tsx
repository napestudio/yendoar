import { EventPayment, ValidatorToken } from "@prisma/client";
import { DiscountCode } from "./discount-code";
import { TicketType } from "./tickets";
import { User } from "./user";

export type EventStatus =
  | "DRAFT"
  | "ACTIVE"
  | "CANCELED"
  | "CONCLUDED"
  | "DELETED";

export interface Evento {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  userId: string;
  image: string;
  dates: string;
  status?: EventStatus;
  user?: User;
  discountCode?: DiscountCode[] | undefined;
  ticketTypes?: TicketType[];
  validatorToken?: ValidatorToken[];
  eventPayments?: EventPayment[];
}

import { DiscountCode } from "./discount-code";
import { User } from "./user";

export type EventStatus = "DRAFT" | "ACTIVE" | "CONCLUDED" | "DELETED";

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
}

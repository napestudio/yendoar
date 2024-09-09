import { Product } from "@/types/product";
import MpButton from "./mp-button";
import { getMercadPagoUrl } from "@/lib/actions";

export default async function MpButtonServer() {
  return <MpButton />;
}

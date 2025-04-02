"use client";

import { assignPaymentMethodsToEvent } from "@/lib/actions";

import { DropdownMenuItem } from "../ui/dropdown-menu";

type AssignMethodProp = {
  eventId: string;
  paymentMethodIds: string[];
};

export default function AssignPaymentMethodButton({
  eventId,
  paymentMethodIds,
}: AssignMethodProp) {
  const handleAssign = () => {
    assignPaymentMethodsToEvent({ eventId, paymentMethodIds });
  };

  return <DropdownMenuItem onClick={handleAssign}>+ Asignar</DropdownMenuItem>;
}

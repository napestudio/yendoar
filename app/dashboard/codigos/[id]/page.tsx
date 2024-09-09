import { getDiscountCodeById } from "@/lib/actions";
import { getEventsByUserId } from "@/lib/api/eventos";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditCodeForm from "@/app/dashboard/components/edit-discount-code/edit-discount-code-form";
import { DiscountCode } from "@/types/discount-code";
import { Evento } from "@/types/event";
import { getUserByEmail } from "@/lib/api/users";

export default async function EditCode({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = await getUserByEmail(session?.user?.email as string);
  const discountCode = await getDiscountCodeById(params.id);
  const events = await getEventsByUserId(id);

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Editar código
      </h1>
      <div className="bg-gray-100 p-5 rounded w-full">
        <EditCodeForm
          discountCode={discountCode as DiscountCode}
          events={events as Evento[]}
        />
      </div>
    </>
  );
}

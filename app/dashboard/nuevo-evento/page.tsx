import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserByEmail } from "@/lib/api/users";
import CreateEventForm from "../components/create-event/create-event-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewEvent() {
  const session = await getServerSession(authOptions);
  const { id } = await getUserByEmail(session?.user?.email as string);
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Nuevo evento
      </h1>
      <div className="bg-gray-100 p-5 rounded w-full text-left">
        <CreateEventForm userId={id} />
      </div>
    </>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import CreateEventForm from "../components/create-event/create-event-form";

export default async function NewEvent() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const id = session.user.id;
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Nuevo evento
      </h1>
      <div className="bg-gray-100 p-5 mt-5 rounded w-full text-left">
        <CreateEventForm userId={id} />
      </div>
    </>
  );
}

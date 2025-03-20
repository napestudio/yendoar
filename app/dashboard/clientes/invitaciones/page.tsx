import { getServerSession } from "next-auth";
import InvitationsTable from "./table";
import { getInvitationsByUser } from "@/lib/actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import NewClientForm from "../alta/form";
import { redirect } from "next/navigation";

export default async function Invitations() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const id = session.user.id;
  const invitations = await getInvitationsByUser(id);
  if (session?.user.type === "SELLER") {
    redirect("/dashboard");
  }
  return (
    <>
      <div className="w-full">
        <div className="mb-5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Nuevo Cliente
          </h1>
          <div className="bg-gray-50 p-4">
            <NewClientForm userId={id} invitations={invitations} />
          </div>
        </div>
        <hr className="my-8 mx-4" />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Invitaciones Enviadas
        </h1>
        {invitations && (
          <div className="bg-gray-100 p-5 rounded">
            <InvitationsTable invitations={invitations} />
          </div>
        )}
      </div>
    </>
  );
}

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getAllUsers, getUserByEmail } from "@/lib/api/users";
import { getServerSession } from "next-auth";
import { getAllUsersButAdmins, getInvitationsByUser } from "@/lib/actions";
import InvitationsTable from "./invitaciones/table";
import AccountsTable from "./clients-table";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function Clientes() {
  const session = await getServerSession(authOptions);
  const accounts = await getAllUsers();

  if (session?.user.type === "SELLER") {
    redirect("/dashboard");
  }
  return (
    <>
      <h1 className="scroll-m-20 text-4xl mb-5 font-extrabold tracking-tight lg:text-5xl">
        Listado de cuentas
      </h1>
      {accounts && (
        <div className="bg-gray-100 rounded w-full text-left">
          <AccountsTable accounts={accounts} />
        </div>
      )}
    </>
  );
}

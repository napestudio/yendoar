import MercadoPagoForm from "../../mercado-pago-form/mercado-pago-form";
import { getUserByEmail } from "@/lib/api/users";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAllUserConfiguration } from "@/lib/actions";

export default async function MercadoPago() {
  const session = await getServerSession(authOptions);
  const { id } = await getUserByEmail(session?.user?.email as string);
  const userConfiguration = (await getAllUserConfiguration(id)) || [];

  return (
    <>
      <>
        <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Mercado Pago
        </h2>
        <div className="bg-gray-100 p-5 rounded w-full">
          <MercadoPagoForm configuration={userConfiguration} userId={id} />
        </div>
      </>
      {/* )} */}
    </>
  );
}

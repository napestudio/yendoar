import { getUserById } from "@/lib/api/users";
import ClientConfigTable from "./config-table";
import { CircleUserRound } from "lucide-react";
import {
  createUserConfiguration,
  getAllUserConfiguration,
  updateUserConfiguration,
} from "@/lib/actions";
import { revalidatePath } from "next/cache";

export default async function ClientConfig({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserById(params.id);
  const userConfiguration = (await getAllUserConfiguration(user.id)) || [];

  // Si no hay configuración creada para el usuario, creamos una
  if (userConfiguration.length === 0) {
    createUserConfiguration(params.id);
    revalidatePath;
  }
  return (
    <>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Configuración
      </h1>

      <div className="bg-gray-100 p-5 rounded w-full">
        <p className="text-left mb-5 flex gap-2 font-medium pb-2 border-b-2 border-gray-200">
          <CircleUserRound /> {user.name}
        </p>
        {userConfiguration.length > 0 && (
          <ClientConfigTable config={userConfiguration} userId={params.id} />
        )}
      </div>
    </>
  );
}

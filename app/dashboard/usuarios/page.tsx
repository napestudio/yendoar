import DashboardHeader from "@/components/dashboard/dashboard-header";
import StatsCards from "@/components/dashboard/stats-cards";

import UsersTable from "@/components/dashboard/users-table";
import { getUsersByClientId } from "@/lib/api/users";

export default async function UsersPage() {
  const accounts = await getUsersByClientId();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-5">
        <DashboardHeader
          title="Usuarios"
          subtitle="Administra los usuarios de la plataforma"
        />
      </div>
      <div className="w-full space-y-5">
        <StatsCards />

        {accounts && <UsersTable accounts={accounts} />}
      </div>
    </div>
  );
}

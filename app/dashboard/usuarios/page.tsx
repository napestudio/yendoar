import DashboardHeader from "@/components/dashboard/dashboard-header";
import { InviteUserDialog } from "@/components/dashboard/invite-user-dialog";
import StatsCards from "@/components/dashboard/stats-cards";

import UsersTable from "@/components/dashboard/users-table";
import { Button } from "@/components/ui/button";
import { getUsersByClientId } from "@/lib/api/users";
import { Plus } from "lucide-react";

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
        <InviteUserDialog>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Invitar Usuario
          </Button>
        </InviteUserDialog>
        {accounts && <UsersTable accounts={accounts} />}
      </div>
    </div>
  );
}

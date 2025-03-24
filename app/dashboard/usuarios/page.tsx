import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { InviteUserDialog } from "@/components/dashboard/invite-user-dialog";
import StatsCards from "@/components/dashboard/stats-cards";
import UserInvitationsTable from "@/components/dashboard/user-invitations-table";

import UsersTable from "@/components/dashboard/users-table";
import { Button } from "@/components/ui/button";
import { getInvitationsByUser } from "@/lib/actions";
import { getUsersByClientId } from "@/lib/api/users";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function UsersPage() {
  const accounts = await getUsersByClientId();
  const session = await getServerSession(authOptions);
  if (!session) return;
  const userId = session.user.id;
  const invitations = await getInvitationsByUser(userId);

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
        <InviteUserDialog invitations={invitations} userId={userId}>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Invitar Usuario
          </Button>
        </InviteUserDialog>
        {accounts && <UsersTable accounts={accounts} />}
        {invitations && <UserInvitationsTable invitations={invitations} />}
      </div>
    </div>
  );
}

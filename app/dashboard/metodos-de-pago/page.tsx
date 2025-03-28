import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { AddPaymentMethodDialog } from "@/components/dashboard/add-payment-method-dialog";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { PaymentMethodsTable } from "@/components/dashboard/payment-methods-table";
import StatsCards from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { getUsersByType } from "@/lib/actions";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function PaymentMethodsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.clientId) return;
  const sellers = await getUsersByType(session?.user.clientId, "SELLER");
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-5">
        <DashboardHeader
          title="Métodos de pago"
          subtitle="Administra los métodos de pago de tus eventos"
        />
      </div>
      <div className="w-full space-y-5">
        <StatsCards />
        <AddPaymentMethodDialog sellers={sellers}>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Método de pago
          </Button>
        </AddPaymentMethodDialog>
        <PaymentMethodsTable />
      </div>
    </div>
  );
}

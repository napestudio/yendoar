import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "@uploadthing/react/styles.css";

import { authOptions } from "../api/auth/[...nextauth]/options";
import SideBar from "./components/side-bar";

const dashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Support",
      href: "/support",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Eventos",
      href: "/dashboard/eventos",
      icon: "calendar",
    },
    {
      title: "Métodos de pago",
      href: "/dashboard/sales",
      icon: "sales",
    },
    {
      title: "Usuarios",
      href: "/dashboard/customers",
      icon: "users",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Plataforma de venta de entradas online",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <>
      <div className="flex h-svh gap-8 py-2 p-4 md:p-8 mx-auto w-full bg-white">
        {/* <div className="hidden md:block">
          <DashboardNavigation session={session} />
        </div> */}
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          <SideBar session={session} items={dashboardConfig.sidebarNav} />
        </aside>
        <div className="flex flex-col flex-1">{children}</div>
      </div>
    </>
  );
}

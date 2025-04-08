import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "@uploadthing/react/styles.css";

import { authOptions } from "../api/auth/[...nextauth]/options";
import SideBar from "../../components/dashboard/side-bar";
import DashboardNavigation from "./components/dashboard-navigation";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/dashboard/mobile-nav";
import SessionProvider from "@/components/session-provider/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { getSidebarNav } from "./lib/config/dashboard-navigation";
import { UserType } from "@/types/user";

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
      title: "Usuarios",
      href: "/dashboard/usuarios",
      icon: "users",
    },
    {
      title: "Métodos de pago",
      href: "/dashboard/metodos-de-pago",
      icon: "sales",
    },
    // {
    //   title: "Settings",
    //   href: "/dashboard/settings",
    //   icon: "settings",
    // },
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

  const sidebarNav = getSidebarNav(session.user.type as UserType);

  return (
    <>
      <SessionProvider session={session}>
        <MobileSidebar items={dashboardConfig.sidebarNav} />
        <div className="flex min-h-svh gap-8 py-2 p-4 md:py-8 mx-auto w-full bg-white">
          <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
            <SideBar session={session} items={sidebarNav} />
          </aside>
          <div className="flex flex-col flex-1 pb-12">{children}</div>
        </div>
        <Toaster />
      </SessionProvider>
    </>
  );
}

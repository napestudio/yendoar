import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/options";
import DashboardNavigation from "./components/dashboard-navigation";
import SideBar from "./components/side-bar";

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
      <div className="flex h-svh gap-8 py-2 md:p-8 mx-auto w-full bg-white">
        {/* <div className="hidden md:block">
          <DashboardNavigation session={session} />
        </div> */}
        <div className="block md:hidden bg-gray-200 px-8 p-6 rounded-xl">
          <SideBar session={session} />
        </div>
        <div className="w-[550px] max-w-[95vw] mx-auto flex flex-col text-center py-6">
          {children}
        </div>
      </div>
    </>
  );
}

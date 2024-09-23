import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/options";
import DashboardNavigation from "./components/dashboard-navigation";

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
      <div className="flex flex-col items-center min-h-screen gap-8 py-2 md:p-8 mx-auto w-full bg-white">
        <DashboardNavigation session={session} />
        <div className="w-[550px] max-w-[95vw] mx-auto flex flex-col text-center justify-center">
          {children}
        </div>
      </div>
    </>
  );
}

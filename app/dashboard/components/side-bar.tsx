"use client";

import { Home } from "lucide-react";

import Link from "next/link";
import { menuData } from "../data/menuData";
import AdminDropDown from "@/components/admin-dropdown/admin-dropdown";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SideBar({ session }: { session: any }) {
  const filteredMenuData = menuData.filter(
    (section) =>
      !(session.user.type === "SELLER" && section.title === "Cuentas")
  );

  return (
    <div className="flex flex-col gap-4 justify-between h-full">
      <div>
        {filteredMenuData.map((section) =>
          section.items ? (
            <div key={section.title} className="flex flex-col">
              <div className="font-bold">{section.title}</div>
              {section.items.map((item) => (
                <Link key={item.title} href={item.href}>
                  {item.title}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              href={section.href ?? "#"}
              legacyBehavior
              passHref
              key={section.title}
            >
              {section.href === "/dashboard" ? (
                <Home className="mb-10" />
              ) : (
                section.title
              )}
            </Link>
          )
        )}
      </div>
      <div>
        <div className="flex">
          <Avatar className="h-9 w-9 relative">
            <AvatarImage alt="@shadcn" src={session.user?.image as string} />
            <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            variant={"link"}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

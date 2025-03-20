"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Session } from "@prisma/client";
import { Home } from "lucide-react";
import { SessionContextValue } from "next-auth/react";
import Link from "next/link";
import { menuData } from "../data/menuData";

export default function SideBar({ session }: { session: any }) {
  const filteredMenuData = menuData.filter(
    (section) =>
      !(session.user.type === "SELLER" && section.title === "Cuentas")
  );

  return (
    <div className="flex flex-col gap-4">
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
  );
}

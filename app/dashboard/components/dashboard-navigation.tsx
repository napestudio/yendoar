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

interface MenuItem {
  title: string;
  href: string;
}

interface MenuSection {
  title: string;
  items?: MenuItem[];
  href?: string;
}

const menuData: MenuSection[] = [
  {
    title: "Panel",
    href: "/dashboard",
  },
  {
    title: "Eventos",
    items: [
      { title: "Nuevo", href: "/dashboard/nuevo-evento/" },
      { title: "Lista de eventos", href: "/dashboard/eventos/" },
      { title: "Codigos de descuento", href: "/dashboard/codigos" },
    ],
  },
  {
    title: "Cuentas",
    items: [
      { title: "Listado", href: "/dashboard/clientes" },
      { title: "Invitaciones", href: "/dashboard/clientes/invitaciones" },
    ],
  },
  {
    title: "Configuración",
    items: [
      { title: "MercadoPago", href: "/dashboard/configuracion/mercado-pago" },
      // {
      //   title: "Notificaciónes",
      //   href: "/dashboard/configuracion/notificaciones",
      // },
    ],
  },
  // { title: "Perfil", href: "/dashboard/configuracion/perfil" },
];

export default function DashboardNavigation({ session }: { session: any }) {
  const filteredMenuData = menuData.filter(
    (section) =>
      !(session.user.type === "SELLER" && section.title === "Cuentas")
  );

  return (
    <div className="flex">
      {filteredMenuData.map((section) =>
        section.items ? (
          <NavigationMenu key={section.title}>
            <NavigationMenuList>
              <NavigationMenuItem key={section.title}>
                <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[200px] lg:w-[300px] lg:grid-cols-1">
                    {section.items.map((item) => (
                      <li key={item.title} className="p-0">
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block p-2 rounded-md hover:bg-gray-200 whitespace-nowrap"
                          >
                            {item.title}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <NavigationMenu key={section.title}>
            <NavigationMenuList>
              <NavigationMenuItem key={section.title}>
                <Link href={section.href ?? "#"} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {section.href === "/dashboard" ? <Home /> : section.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )
      )}
    </div>
  );
}

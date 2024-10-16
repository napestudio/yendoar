import type { Metadata } from "next";
import "./global.scss";
import NavBar from "@/components/nav-bar/nav-bar";
import { Session, User, getServerSession } from "next-auth";
import SessionProvider from "@/components/session-provider/session-provider";
import { getUserByEmail } from "@/lib/api/users";
import { authOptions } from "./api/auth/[...nextauth]/options";
import Footer from "@/components/footer/footer";
import { Toaster } from "@/components/ui/toaster";

import { Montserrat } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import PreFooter from "@/components/pre-footer/pre-footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["900", "700", "500", "400"],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Entradas online`,
  description: `${SITE_DESCRIPTION}`,
  // openGraph: { images: { url: "/og.jpg" } },
  openGraph: {
    title: `${SITE_NAME} | Entradas online`,
    description: `${SITE_DESCRIPTION}`,
    images: { url: "/og.jpg" },
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Entradas online`,
    description: `${SITE_DESCRIPTION}`,
    images: { url: "/og.jpg" },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  let user = {};
  if (session && session.user) {
    user = await getUserByEmail(session?.user?.email as string);
  }

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <SessionProvider session={session}>
          <NavBar user={user} session={session as Session} />
          <main className="flex flex-col items-center gap-8 bg-blue">
            {children}
          </main>
          <PreFooter />
          <Toaster />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

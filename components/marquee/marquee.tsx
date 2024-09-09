"use client";
import { Reeller, ScrollerPlugin } from "reeller";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { HomeCard } from "@/types/card";
import { datesFormater } from "@/lib/utils";
import { Dot, Rocket } from "lucide-react";
import Link from "next/link";

Reeller.registerGSAP(gsap);
Reeller.use(ScrollerPlugin);

export default function EventMarquee({ eventos }: { eventos: HomeCard[] }) {
  const reelRef = useRef<HTMLDivElement>(null);
  const reellerRef = useRef<Reeller | null>(null);
  const [originalSpeed, setOriginalSpeed] = useState(20);

  useEffect(() => {
    if (reelRef.current) {
      reellerRef.current = new Reeller({
        container: ".my-reel",
        wrapper: ".my-reel-wrap",
        itemSelector: ".my-reel-item",
        speed: originalSpeed,
        paused: false,
        autoStop: true,
        plugins: {
          scroller: {
            speed: 5,
            multiplier: 0.5,
            threshold: 1,
          },
        },
      });

      return () => {
        reellerRef.current?.destroy();
      };
    }
  }, []);

  return (
    <div className="my-reel py-2" ref={reelRef}>
      <div className="my-reel-wrap flex gap-5">
        {eventos.map((evento) => (
          <div className="my-reel-item whitespace-nowrap" key={evento.id}>
            <div className="text-5xl gradient-marquee hover:text-white transition-colors text-stroke uppercase">
              <Link
                href={`eventos/${evento.id}`}
                className="flex gap-2 items-end hover:text-white"
              >
                <span className="font-bold">{evento.title}</span>
                <span className="font-medium text-xl">
                  {datesFormater(evento.dates as string)}
                </span>{" "}
                <span className="text-2xl font-bold">{evento.location}</span>
                <span className="ml-2 font-bold">/</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

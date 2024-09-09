import EventCard from "@/components/event-card/event-card";
import EventMarquee from "@/components/marquee/marquee";
import { getAllEvents } from "@/lib/api/eventos";
import { HomeCard } from "@/types/card";

export default async function Home() {
  const eventos = await getAllEvents();

  return (
    <>
      <section className="container pb-14">
        <h1 className="mb-14 mt-10 scroll-m-20 text-4xl tracking-tight lg:text-7xl text-white text-stroke">
          <span className="font-extrabold">PROXIMOS</span>{" "}
          <span className="font-thin">EVENTOS</span>
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {eventos &&
            eventos.map((evento: HomeCard) => (
              <EventCard evento={evento} key={evento.id} />
            ))}
        </div>
      </section>
      <div className="w-full overflow-hidden py-5 relative mt-10">
        <EventMarquee eventos={eventos} />
      </div>
    </>
  );
}

import EventInfo from "@/app/validar/[eventId]/event-info";

export default async function Estadisticas({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <h1 className="mb-5 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
        Información
      </h1>
      <section className="text-left">
        <EventInfo eventId={params.id} type={"ESTADISTICAS"} />
      </section>
    </>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[350px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[350px]" />
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[350px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[350px]" />
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[350px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[350px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

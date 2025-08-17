import { Skeleton } from "../../../components/Skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-3xl">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

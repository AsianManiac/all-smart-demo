import { Skeleton } from "@/components/ui/skeleton";

export function VideoDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-8 rounded-md" />
          <Skeleton className="w-20 h-8 rounded-md" />
        </div>
      </div>

      <div className="rounded-lg p-4 border">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function VideoCommentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="grid grid-cols-7 gap-2 mb-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-md" />
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4 md:w-1/3">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="w-16 h-5" />
                </div>
                <Skeleton className="w-full h-24 rounded-md" />
              </div>
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>

            <div className="md:w-1/3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>

            <div className="md:w-1/3 flex justify-end items-center">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecommendedVideosSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <div className="relative flex-shrink-0">
            <Skeleton className="w-40 h-24 rounded-lg" />
            <Skeleton className="absolute bottom-1 right-1 w-8 h-4 rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

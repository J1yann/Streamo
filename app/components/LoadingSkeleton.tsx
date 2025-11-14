import { motion } from "framer-motion";

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-2/3 bg-black/10 dark:bg-white/10 rounded-xl" />
      <div className="mt-3 px-1">
        <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4" />
      </div>
    </div>
  );
}

export function ScrollerSkeleton() {
  return (
    <section className="mb-12">
      <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-48 mb-4 mx-4 md:mx-6 lg:mx-8" />
      <div className="flex gap-4 px-4 md:px-6 lg:px-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-none w-[160px] md:w-[200px]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

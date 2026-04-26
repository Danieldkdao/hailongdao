"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getMathProblems, GetMathProblemsType } from "../actions/actions";
import { useMathProblemFilters } from "../hooks/use-math-problem-params";
import { MathProblemCard } from "./math-problem-card";
import { Loader2Icon } from "lucide-react";

type MathProblem = GetMathProblemsType["mathProblems"][number];

export const InfiniteMathCardGrid = ({
  initialMathProblems,
  initialHasNextPage,
}: {
  initialMathProblems: MathProblem[];
  initialHasNextPage: boolean;
}) => {
  const [filters] = useMathProblemFilters();
  const [mathProblems, setMathProblems] = useState(initialMathProblems);
  const [page, setPage] = useState(filters.page);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMathProblems(initialMathProblems);
    setPage(filters.page);
    setHasNextPage(initialHasNextPage);
  }, [initialMathProblems, initialHasNextPage, filters.page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isPending) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        startTransition(async () => {
          const nextPage = page + 1;

          const data = await getMathProblems({
            ...filters,
            page: nextPage,
          });

          setMathProblems((current) => [...current, ...data.mathProblems]);
          setPage(nextPage);
          setHasNextPage(data.metadata.hasNextPage);
        });
      },
      {
        rootMargin: "400px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [filters, page, hasNextPage, isPending]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {mathProblems.map((problem) => (
          <MathProblemCard key={problem.id} mathProblem={problem} />
        ))}
      </div>
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isPending && (
          <Loader2Icon className="animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

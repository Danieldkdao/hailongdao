import { getMathProblems } from "@/features/math-problems/actions/actions";
import { MathCardGrid } from "@/features/math-problems/components/math-card-grid";
import { MathMainFilters } from "@/features/math-problems/components/math-main-filters";
import { MathMainPagination } from "@/features/math-problems/components/math-main-pagination";
import { loadSearchParams } from "@/features/math-problems/lib/params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import {
  HomeFiltersSkeleton,
  HomeMathProblemsEmptyState,
  MathProblemsGridSkeleton,
} from "@/components/async-states";
import { AsyncErrorBoundary } from "@/components/async-error-boundary";

type HomeProps = {
  searchParams: Promise<SearchParams>;
};

const HomePage = (props: HomeProps) => {
  return (
    <div className="flex flex-col items-center py-10 gap-16 px-10">
      <div className="flex flex-col gap-6 mt-32 items-center w-full">
        <h1 className="text-6xl font-bold text-center">
          Fun Problems in{" "}
          <span className="text-primary">Commutative Algebra</span>
        </h1>

        <Suspense fallback={<HomeFiltersSkeleton />}>
          <AsyncErrorBoundary
            variant="inline"
            title="Filters unavailable"
            description="Search and sorting controls could not be loaded."
          >
            <MathMainFilters />
          </AsyncErrorBoundary>
        </Suspense>
      </div>
      <div className="w-full">
        <Suspense fallback={<MathProblemsGridSkeleton />}>
          <AsyncErrorBoundary
            title="Couldn't load math problems"
            description="The problem feed is unavailable right now. Please try again."
          >
            <HomeSuspense {...props} />
          </AsyncErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
};

const HomeSuspense = async ({ searchParams }: HomeProps) => {
  const filters = await loadSearchParams(searchParams);
  const data = await getMathProblems(filters);
  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.sortBy !== "" ||
    filters.difficultyLevels.length > 0 ||
    filters.problemStatuses.length > 0;

  if (data.mathProblems.length === 0) {
    return <HomeMathProblemsEmptyState hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <div className="space-y-6 w-full max-w-300 mx-auto">
      <MathCardGrid mathProblems={data.mathProblems} />
      <MathMainPagination metadata={data.metadata} />
    </div>
  );
};

export default HomePage;

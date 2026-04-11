import { getMathProblems } from "@/features/math-problems/actions/actions";
import { MathCardGrid } from "@/features/math-problems/components/math-card-grid";
import { MathMainFilters } from "@/features/math-problems/components/math-main-filters";
import { MathMainPagination } from "@/features/math-problems/components/math-main-pagination";
import { loadSearchParams } from "@/features/math-problems/lib/params";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type HomeProps = {
  searchParams: Promise<SearchParams>;
};

const HomePage = (props: HomeProps) => {
  return (
    <div className="flex flex-col items-center py-10 gap-16 px-10">
      <div className="flex flex-col gap-6 mt-32">
        <h1 className="text-6xl font-bold text-center">
          Fun Problems in{" "}
          <span className="text-primary">Commutative Algebra</span>
        </h1>

        <Suspense>
          <MathMainFilters />
        </Suspense>
      </div>
      <div className="w-full">
        <Suspense fallback={<div>loading...</div>}>
          <ErrorBoundary fallback={<div>error...</div>}>
            <HomeSuspense {...props} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
};

const HomeSuspense = async ({ searchParams }: HomeProps) => {
  const filters = await loadSearchParams(searchParams);
  const data = await getMathProblems(filters);

  return (
    <div className="space-y-6 w-full max-w-300 mx-auto">
      <MathCardGrid mathProblems={data.mathProblems} />
      <MathMainPagination metadata={data.metadata} />
    </div>
  );
};

export default HomePage;

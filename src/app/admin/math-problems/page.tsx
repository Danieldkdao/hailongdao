import { getUserMathProblems } from "@/features/math-problems/actions/actions";
import { MathProblemListTable } from "@/features/math-problems/components/math-problem-list-table";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { Suspense } from "react";
import { AdminTableSkeleton } from "@/components/async-states";
import { AsyncErrorBoundary } from "@/components/async-error-boundary";

const MathProblemsPage = () => {
  return (
    <div className="space-y-4 py-10 px-6">
      <h1 className="text-3xl font-bold">Math Problems</h1>
      <Suspense fallback={<AdminTableSkeleton columns={9} />}>
        <AsyncErrorBoundary
          title="Couldn't load math problems"
          description="The admin problem list could not be loaded right now. Please retry shortly."
        >
          <MathProblemsSuspense />
        </AsyncErrorBoundary>
      </Suspense>
    </div>
  );
};

const MathProblemsSuspense = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user || user.role !== "admin") return null;

  const mathProblems = await getUserMathProblems(userId);

  return <MathProblemListTable mathProblems={mathProblems} />;
};

export default MathProblemsPage;

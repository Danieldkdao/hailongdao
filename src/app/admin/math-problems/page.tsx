import { getUserMathProblems } from "@/features/math-problems/actions/actions";
import { MathProblemListTable } from "@/features/math-problems/components/math-problem-list-table";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { hasPermission } from "@/features/user/lib/permissions";
import { Suspense } from "react";
import { AdminTableSkeleton } from "@/components/async-states";
import { AsyncErrorBoundary } from "@/components/async-error-boundary";
import { redirect } from "next/navigation";

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
  const [{ userId }, canReadMathProblems] = await Promise.all([
    getCurrentUser(),
    hasPermission({ mathProblem: ["read"] }),
  ]);
  if (!userId || !canReadMathProblems) {
    redirect("/");
  }

  const mathProblems = await getUserMathProblems(userId);

  return <MathProblemListTable mathProblems={mathProblems} />;
};

export default MathProblemsPage;

import { getUserMathProblems } from "@/features/math-problems/actions/actions";
import { MathProblemListTable } from "@/features/math-problems/components/math-problem-list-table";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { Suspense } from "react";

const MathProblemsPage = () => {
  return (
    <div className="space-y-4 py-10 px-6">
      <h1 className="text-3xl font-bold">Math Problems</h1>
      <Suspense>
        <MathProblemsSuspense />
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

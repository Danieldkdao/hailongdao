import { GetMathProblemsType } from "../actions/actions";
import { MathProblemCard } from "./math-problem-card";

export const MathCardGrid = async ({
  mathProblems,
}: {
  mathProblems: GetMathProblemsType["mathProblems"];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {mathProblems.map((problem) => (
        <MathProblemCard key={problem.id} mathProblem={problem} />
      ))}
    </div>
  );
};

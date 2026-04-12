import { MathProblemDifficultyLevel } from "@/db/schema";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

export const DifficultyStars = ({
  difficultyLevel,
  className,
}: {
  difficultyLevel: MathProblemDifficultyLevel;
  className?: string;
}) => {
  const colorMap: Record<MathProblemDifficultyLevel, string> = {
    1: "text-green-500 fill-green-500",
    2: "text-green-600 fill-green-600",
    3: "text-yellow-500 fill-yellow-500",
    4: "text-yellow-600 fill-yellow-600",
    5: "text-red-500 fill-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            className,
            difficultyLevel >= i + 1 && colorMap[difficultyLevel],
          )}
        />
      ))}
    </div>
  );
};

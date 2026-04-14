import { Card, CardContent } from "@/components/ui/card";
import { GetMathProblemsType } from "../actions/actions";
import {
  ArrowRightIcon,
  EyeIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDateOnly, formatNumberTruncate } from "@/lib/utils";
import { getMathProblemProblemStatus } from "./formatters";
import { DifficultyStars } from "@/components/difficulty-stars";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";

export const MathProblemCard = ({
  mathProblem,
}: {
  mathProblem: GetMathProblemsType["mathProblems"][number];
}) => {
  const linkHref = `/problems/${mathProblem.id}`;

  return (
    <Card className="h-full">
      <CardContent className="h-full">
        <div className="flex items-center flex-col gap-1">
          <Link href={linkHref}>
            <MarkdownRenderer className="text-xl font-bold text-center">
              {mathProblem.title}
            </MarkdownRenderer>
          </Link>
          <span>
            Posted on {formatDateOnly(mathProblem.createdAt)} by{" "}
            <span className="font-medium">{mathProblem.user.name}</span>
          </span>
          <div className="flex justify-center items-center gap-2 flex-wrap mt-2">
            <Badge variant="outline">
              <DifficultyStars
                difficultyLevel={mathProblem.difficultyLevel}
                className="size-4"
              />
            </Badge>
            <Badge variant="outline">
              {getMathProblemProblemStatus(mathProblem.problemStatus)}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap mt-1">
            <Badge variant="outline">
              <EyeIcon className="size-4" />
              {formatNumberTruncate(mathProblem.views)} views
            </Badge>
            <Badge variant="outline">
              <MessageSquareIcon className="size-4" />
              {formatNumberTruncate(mathProblem.commentCount)} comments
            </Badge>
            <Badge variant="outline">
              <ThumbsUpIcon className="size-4" />
              {formatNumberTruncate(mathProblem.upVoteCount)} upvotes
            </Badge>
          </div>
          <Button variant="ghost" className="w-full mt-2" asChild>
            <Link href={linkHref}>
              <ArrowRightIcon />
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

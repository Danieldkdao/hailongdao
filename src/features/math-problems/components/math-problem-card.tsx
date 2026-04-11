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

export const MathProblemCard = ({
  mathProblem,
}: {
  mathProblem: GetMathProblemsType["mathProblems"][number];
}) => {
  return (
    <Card className="h-full">
      <CardContent className="h-full">
        <div className="flex items-center flex-col gap-1">
          <h1 className="line-clamp-2 text-xl font-bold">
            {mathProblem.title}
          </h1>
          <span>
            Posted on {mathProblem.createdAt.toLocaleDateString()} by{" "}
            <span className="font-medium">{mathProblem.user.name}</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <Badge variant="outline">
              <EyeIcon className="size-4" />
              {mathProblem.views} views
            </Badge>
            <Badge variant="outline">
              <MessageSquareIcon className="size-4" />
              {mathProblem.commentCount} comments
            </Badge>
            <Badge variant="outline">
              <ThumbsUpIcon className="size-4" />
              {mathProblem.upVoteCount} upvotes
            </Badge>
          </div>
          <p className="line-clamp-2 text-muted-foreground mt-2">
            {mathProblem.content}
          </p>
          <Button variant="ghost" className="w-full mt-2" asChild>
            <Link href={`/problems/${mathProblem.id}`}>
              <ArrowRightIcon />
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

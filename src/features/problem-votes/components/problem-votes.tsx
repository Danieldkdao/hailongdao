"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { useState } from "react";
import { voteOnProblem } from "../actions/action";
import { VoteType } from "@/db/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const ProblemVotes = ({
  mathProblemId,
  currentUserVote,
}: {
  mathProblemId: string;
  currentUserVote: VoteType | null;
}) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const vote = async (type: VoteType) => {
    if (isPending) return;
    setIsPending(true);
    const response = await voteOnProblem(mathProblemId, type);
    if (response.error) {
      toast.error(response.message);
      setIsPending(false);
      return;
    }
    setIsPending(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 self-start">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => vote("up")}>
            <ThumbsUpIcon
              className={cn(
                currentUserVote === "up" && "fill-primary text-primary",
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>I like this</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => vote("down")}>
            <ThumbsDownIcon
              className={cn(
                currentUserVote === "down" && "fill-primary text-primary",
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>I dislike this</TooltipContent>
      </Tooltip>
    </div>
  );
};

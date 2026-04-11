"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { VoteType } from "@/db/schema";
import { cn, formatNumberTruncate } from "@/lib/utils";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { useState } from "react";
import { voteOnComment } from "../actions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CommentVoteButtonsProps = {
  commentId: string;
  upVoteCount: number;
  downVoteCount: number;
  currentUserVote: VoteType | null;
};

export const CommentVoteButtons = ({
  commentId,
  upVoteCount,
  downVoteCount,
  currentUserVote,
}: CommentVoteButtonsProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const vote = async (type: VoteType) => {
    if (isPending) return;
    setIsPending(true);
    const response = await voteOnComment({ commentId, unsafeType: type });
    if (response.error) {
      toast.error(response.message);
      setIsPending(false);
      return;
    }
    setIsPending(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => vote("up")}
            disabled={isPending}
          >
            <ThumbsUpIcon
              className={cn(
                currentUserVote === "up" && "fill-primary text-primary",
              )}
            />
            {formatNumberTruncate(upVoteCount)}
          </Button>
        </TooltipTrigger>
        <TooltipContent>I like this</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => vote("down")}
            disabled={isPending}
          >
            <ThumbsDownIcon
              className={cn(
                currentUserVote === "down" && "fill-primary text-primary",
              )}
            />
            {formatNumberTruncate(downVoteCount)}
          </Button>
        </TooltipTrigger>
        <TooltipContent>I dislike this</TooltipContent>
      </Tooltip>
    </div>
  );
};

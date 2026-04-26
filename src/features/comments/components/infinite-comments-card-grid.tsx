"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getComments, GetCommentsType } from "../actions/actions";
import { useCommentFilters } from "../hooks/use-comment-params";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon, MessageSquareIcon } from "lucide-react";
import { Comment } from "./comment";

type CommentItem = GetCommentsType["comments"][number];

export const InfiniteCommentsGridCard = ({
  initialComments,
  initialHasNextPage,
  userId,
  mathProblemId,
}: {
  initialComments: CommentItem[];
  initialHasNextPage: boolean;
  userId: string | null;
  mathProblemId: string;
}) => {
  const [filters] = useCommentFilters();
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(filters.page);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setComments(initialComments);
    setPage(filters.page);
    setHasNextPage(initialHasNextPage);
  }, [initialComments, initialHasNextPage, filters.page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isPending) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        startTransition(async () => {
          const nextPage = page + 1;

          const data = await getComments({
            userId,
            mathProblemId,
            sortBy: filters.sortBy,
            page: nextPage,
          });

          setComments((current) => [...current, ...data.comments]);
          setPage(nextPage);
          setHasNextPage(data.metadata.hasNextPage);
        });
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [filters.sortBy, page, hasNextPage, isPending, userId, mathProblemId]);

  if (comments.length === 0) {
    return (
      <Card className="border-2 border-border border-dashed">
        <CardContent className="flex flex-col items-center gap-2">
          <MessageSquareIcon className="size-10" />
          <h1 className="text-center text-xl font-bold">No comments yet</h1>
          <p className="text-center text-base text-muted-foreground">
            Be the first to start the discussion!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <div ref={sentinelRef} className="flex justify-center py-4">
        {isPending && (
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

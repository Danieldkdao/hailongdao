import { AsyncErrorBoundary } from "@/components/async-error-boundary";
import { ProblemDetailSkeleton } from "@/components/async-states";
import { DifficultyStars } from "@/components/difficulty-stars";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getComments } from "@/features/comments/actions/actions";
import { CommentListFilters } from "@/features/comments/components/comment-list-filters";
import { CommentsCardList } from "@/features/comments/components/comments-card-grid";
import { CommentsPagination } from "@/features/comments/components/comments-pagination";
import { CreateCommentForm } from "@/features/comments/components/create-comment-form";
import { loadSearchParams } from "@/features/comments/lib/params";
import { getOneMathProblem } from "@/features/math-problems/actions/actions";
import { getMathProblemProblemStatus } from "@/features/math-problems/components/formatters";
import { IncrementProblemViewCount } from "@/features/math-problems/components/increment-problem-view-count";
import { ProblemVoteButtons } from "@/features/problem-votes/components/problem-vote-buttons";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { formatDateOnly, formatNumberTruncate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  DumbbellIcon,
  EyeIcon,
  TagIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

type ProblemIdProps = {
  params: Promise<{ mathProblemId: string }>;
  searchParams: Promise<SearchParams>;
};

const ProblemIdPage = (props: ProblemIdProps) => {
  return (
    <Suspense fallback={<ProblemDetailSkeleton />}>
      <AsyncErrorBoundary
        title="Couldn't load this problem"
        description="The problem details or discussion could not be loaded right now."
      >
        <ProblemIdSuspense {...props} />
      </AsyncErrorBoundary>
    </Suspense>
  );
};

const ProblemIdSuspense = async ({ params, searchParams }: ProblemIdProps) => {
  const { mathProblemId } = await params;
  const filters = await loadSearchParams(searchParams);
  const { userId } = await getCurrentUser();
  const mathProblem = await getOneMathProblem(userId, mathProblemId);
  if (!mathProblem) notFound();
  const data = await getComments({ userId, mathProblemId, ...filters });
  const user = mathProblem.user;

  return (
    <div className="py-10 px-6 w-full">
      <div className="w-full mx-auto max-w-5xl bg-card border border-border p-6 flex flex-col items-center gap-2">
        <Button variant="ghost" className="w-fit self-start" asChild>
          <Link href="/">
            <ArrowLeftIcon />
            Back to Home
          </Link>
        </Button>
        <IncrementProblemViewCount mathProblemId={mathProblem.id} />
        <MarkdownRenderer className="[&_p:first-child]:text-4xl text-center [&_p:first-child]:font-bold [&_p:first-child]:leading-tight [&_p:first-child]:my-0">
          {mathProblem.title}
        </MarkdownRenderer>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <UserAvatar name={user.name} image={user.image} />
            <span className="font-medium text-base">{user.name}</span>
          </div>
          <span>•</span>
          <span>Posted on {formatDateOnly(mathProblem.createdAt)}</span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DumbbellIcon className="size-4" />
                Difficulty
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  size="md"
                  className="rounded-full bg-background/80 px-3 py-1.5"
                >
                  <DifficultyStars
                    difficultyLevel={mathProblem.difficultyLevel}
                    className="size-4"
                  />
                  <span className="ml-1">
                    {mathProblem.difficultyLevel} / 5
                  </span>
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              Problem Status
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  size="md"
                  className="rounded-full bg-background/80 px-3 py-1.5"
                >
                  {getMathProblemProblemStatus(mathProblem.problemStatus)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TagIcon className="size-4" />
              Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {mathProblem.keywords.length > 0 ? (
                mathProblem.keywords.map((keyword) => (
                  <Badge
                    key={keyword.id}
                    variant="secondary"
                    size="sm"
                    className="rounded-full px-3 py-1"
                  >
                    {keyword.keyword}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No keywords added yet.
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <EyeIcon className="size-4" />
            {formatNumberTruncate(mathProblem.views)} views
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUpIcon className="size-4" />
            {formatNumberTruncate(mathProblem.upVoteCount)} upvotes
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDownIcon className="size-4" />
            {formatNumberTruncate(mathProblem.downVoteCount)} downvotes
          </div>
        </div>

        <MarkdownRenderer className="py-6 text-center">
          {mathProblem.content}
        </MarkdownRenderer>

        <ProblemVoteButtons
          mathProblemId={mathProblemId}
          currentUserVote={mathProblem.currentUserVote}
        />

        <Separator className="mb-2" />
        <div className="space-y-4 w-full">
          <h2 className="text-2xl font-bold">
            Comments ({data.comments.length})
          </h2>
          <CommentListFilters />
          <CommentsCardList comments={data.comments} />
          <CreateCommentForm mathProblemId={mathProblemId} />
          <CommentsPagination metadata={data.metadata} />
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;

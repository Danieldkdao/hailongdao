import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getComments } from "@/features/comments/actions/actions";
import { CommentListFilters } from "@/features/comments/components/comment-list-filters";
import { CommentsCardList } from "@/features/comments/components/comments-card-grid";
import { CommentsPagination } from "@/features/comments/components/comments-pagination";
import { CreateCommentForm } from "@/features/comments/components/create-comment-form";
import { loadSearchParams } from "@/features/comments/lib/params";
import { getOneMathProblem } from "@/features/math-problems/actions/actions";
import { IncrementProblemViewCount } from "@/features/math-problems/components/increment-problem-view-count";
import { ProblemVoteButtons } from "@/features/problem-votes/components/problem-vote-buttons";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { formatNumberTruncate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  EyeIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type ProblemIdProps = {
  params: Promise<{ mathProblemId: string }>;
  searchParams: Promise<SearchParams>;
};

const ProblemIdPage = (props: ProblemIdProps) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ErrorBoundary fallback={<div>error...</div>}>
        <ProblemIdSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProblemIdSuspense = async ({ params, searchParams }: ProblemIdProps) => {
  const { mathProblemId } = await params;
  const filters = await loadSearchParams(searchParams);
  const { userId } = await getCurrentUser();
  const mathProblem = await getOneMathProblem(userId, mathProblemId);
  const data = await getComments({ userId, mathProblemId, ...filters });
  const user = mathProblem.user;

  if (!mathProblem) return <div>empty state here</div>;

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
        <h1 className="text-4xl font-bold">{mathProblem.title}</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <UserAvatar name={user.name} image={user.image} />
            <span className="font-medium text-base">{user.name}</span>
          </div>
          <span>•</span>
          <span>Posted on {mathProblem.createdAt.toLocaleDateString()}</span>
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

        <MarkdownRenderer className="py-6">
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

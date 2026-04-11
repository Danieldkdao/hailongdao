import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getComments } from "@/features/comments/actions/actions";
import { CommentsCardList } from "@/features/comments/components/comments-card-grid";
import { CommentsPagination } from "@/features/comments/components/comments-pagination";
import { CreateCommentForm } from "@/features/comments/components/create-comment-form";
import { loadSearchParams } from "@/features/comments/lib/params";
import { getOneMathProblem } from "@/features/math-problems/actions/actions";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { EyeIcon, MessageSquareIcon, ThumbsUpIcon } from "lucide-react";
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
  const mathProblem = await getOneMathProblem(mathProblemId);
  const data = await getComments({ mathProblemId, ...filters });
  const user = mathProblem.user;

  if (!mathProblem) return <div>empty state here</div>;

  return (
    <div className="py-10 px-6 w-full">
      <div className="w-full mx-auto max-w-5xl bg-card border border-border p-6 flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{mathProblem.title}</h1>
        <div className="flex flex-col gap-2">
          <span>Posted on {mathProblem.createdAt.toLocaleDateString()}</span>
          <div className="flex items-center gap-2">
            <UserAvatar name={user.name} image={user.image} />
            <span className="font-medium text-base">{user.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-1">
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
        <MarkdownRenderer>{mathProblem.content}</MarkdownRenderer>
        <Separator className="mb-2" />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Comments ({mathProblem.commentCount})
          </h2>
          <CommentsCardList comments={data.comments} />
          <CreateCommentForm />
          <CommentsPagination metadata={data.metadata} />
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;

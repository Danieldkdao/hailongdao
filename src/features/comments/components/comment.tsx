import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { formatDateOnly } from "@/lib/utils";
import { GetCommentsType } from "../actions/actions";
import { CommentVoteButtons } from "@/features/comment-votes/components/comment-vote-buttons";

export const Comment = ({
  comment,
}: {
  comment: GetCommentsType["comments"][number];
}) => {
  return (
    <div className="w-full border-b border-b-dashed p-4">
      <div className="flex min-w-0 items-start gap-4">
        <UserAvatar
          name={comment.user?.name ?? "ANONYMOUS"}
          image={comment.user?.image}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2">
            <span className="font-medium">
              {comment.user?.name ?? "Anonymous"}
            </span>
            <CommentVoteButtons commentId={comment.id} {...comment} />
          </div>

          <span className="text-muted-foreground">
            Posted on {formatDateOnly(comment.createdAt)}
          </span>
          <MarkdownRenderer>{comment.content}</MarkdownRenderer>
        </div>
      </div>
    </div>
  );
};

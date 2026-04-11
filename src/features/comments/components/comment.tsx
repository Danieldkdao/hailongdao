import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { GetCommentsType } from "../actions/actions";

export const Comment = ({
  comment,
}: {
  comment: GetCommentsType["comments"][number];
}) => {
  return (
    <div className="p-4 border-b border-b-dashed">
      <div className="flex items-start gap-4">
        <UserAvatar
          name={comment.user?.name ?? "ANONYMOUS"}
          image={comment.user?.image}
        />
        <div className="flex flex-col gap-2">
          <span>{comment.user?.name ?? "Anonymous"}</span>
          <span>Posted on {comment.createdAt.toLocaleDateString()}</span>
          <MarkdownRenderer>{comment.content}</MarkdownRenderer>
        </div>
      </div>
    </div>
  );
};

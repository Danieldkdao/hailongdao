import { Card, CardContent } from "@/components/ui/card";
import { GetCommentsType } from "../actions/actions";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";

export const CommentCard = ({
  comment,
}: {
  comment: GetCommentsType["comments"][number];
}) => {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <UserAvatar
            name={comment.user?.name ?? "ANONYMOUS"}
            image={comment.user?.image}
          />
          <span>{comment.user?.name ?? "Anonymous"}</span>
        </div>
        <span>Posted on {comment.createdAt.toLocaleDateString()}</span>
        <MarkdownRenderer>{comment.content}</MarkdownRenderer>
      </CardContent>
    </Card>
  );
};

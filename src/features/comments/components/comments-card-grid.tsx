import { Card, CardContent } from "@/components/ui/card";
import { GetCommentsType } from "../actions/actions";
import { Comment } from "./comment";
import { MessageSquareIcon } from "lucide-react";

export const CommentsCardList = ({
  comments,
}: {
  comments: GetCommentsType["comments"];
}) => {
  return (
    <div className="flex flex-col gap-2">
      {comments.length ? (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      ) : (
        <Card className="border-2 border-border border-dashed">
          <CardContent className="flex flex-col items-center gap-2">
            <MessageSquareIcon className="size-10" />
            <h1 className="text-center text-xl font-bold">No comments yet</h1>
            <p className="text-center text-base text-muted-foreground">
              Be the first to start the discussion!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

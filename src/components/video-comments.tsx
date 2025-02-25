import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/types";
import { ThumbsUp } from "lucide-react";
import type React from "react";

interface VideoCommentsProps {
  comments: Comment[];
}

const VideoComments: React.FC<VideoCommentsProps> = ({ comments }) => {
  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="flex gap-4 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.authorProfileImageUrl} alt={comment.author} />
        <AvatarFallback>
          {comment.author.slice(1, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.author}</span>
          <span className="text-sm text-muted-foreground">
            {comment.publishedAt}
          </span>
        </div>
        <p
          className="mt-1 comment"
          dangerouslySetInnerHTML={{ __html: comment.textDisplay }}
        />
        <div className="flex items-center gap-4 mt-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            {comment.likeCount}
          </Button>
          <Button variant="ghost" size="sm">
            Reply
          </Button>
        </div>
        {comment.replies && (
          <div className="ml-8 mt-4">{comment.replies.map(renderComment)}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
      {comments.map(renderComment)}
    </div>
  );
};

export default VideoComments;

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Comment } from "@/types";
import { ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { ErrorState } from "./navigation/api-state";
import { NoComments } from "./navigation/empty-state";
import { VideoCommentsSkeleton } from "./skeleton-loaders";

interface VideoCommentsProps {
  comments: Comment[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  commentsDisabled?: boolean;
  onRetry?: () => void;
}

const VideoComments: React.FC<VideoCommentsProps> = ({
  comments: initialComments = [],
  isLoading = false,
  isError = false,
  error = null,
  commentsDisabled = false,
  onRetry,
}) => {
  const [comments, setComments] = useState(
    (initialComments || []).map((comment) => ({
      ...comment,
      expanded: false,
      showReplies: false,
    }))
  );
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");

  useEffect(() => {
    if (initialComments.length > 0) {
      setComments(
        initialComments.map((comment) => ({
          ...comment,
          expanded: false,
          showReplies: false,
        }))
      );
    }
  }, [initialComments]);

  const toggleCommentExpansion = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, expanded: !comment.expanded }
          : comment
      )
    );
  };

  const toggleReplies = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };

  const sortComments = (type: "top" | "newest") => {
    setSortBy(type);
    const sortedComments = [...comments].sort((a, b) => {
      if (type === "top") {
        return Number.parseInt(b.likeCount) - Number.parseInt(a.likeCount);
      } else {
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
    });
    setComments(sortedComments);
  };

  const renderComment = (
    comment: Comment & { expanded?: boolean; showReplies?: boolean },
    isReply = false
  ) => {
    const isLongComment = comment.textDisplay.length > 300;
    const displayText =
      isLongComment && !comment.expanded
        ? comment.textDisplay.slice(0, 300) + "..."
        : comment.textDisplay;

    const tailwindColors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];
    const name = comment.author;

    const generateRandomTailwindColor = (seed: string): string => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % tailwindColors.length;
      return tailwindColors[index];
    };

    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const fallbackColorClass = generateRandomTailwindColor(name);

    return (
      <div
        key={comment.id}
        className={`flex gap-4 mb-4 ${isReply ? "ml-8" : ""}`}
      >
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage
            src={comment.authorProfileImageUrl}
            alt={comment.author}
          />
          <AvatarFallback className={`${fallbackColorClass} text-white`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-wrap">
            <span className="font-semibold">{comment.author}</span>
            <span className="text-xs text-muted-foreground text-wrap pr-1">
              {comment.publishedAt}
            </span>
          </div>
          <p
            className="mt-1 comment"
            dangerouslySetInnerHTML={{ __html: displayText }}
          />
          {isLongComment && (
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleCommentExpansion(comment.id)}
              className="mt-1 p-0 text-muted-foreground font-medium"
            >
              {comment.expanded ? "Show less" : "Read more"}
            </Button>
          )}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-full"
            >
              <ThumbsUp className="w-4 h-4" />
              {comment.likeCount}
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              Reply
            </Button>
          </div>
          {!isReply && comment.replies && comment.replies.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-2 text-primary rounded-full hover:text-primary hover:bg-primary/20"
              >
                {comment.showReplies ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </Button>
              {comment.showReplies && (
                <div className="mt-2">
                  {comment.replies.map((reply) =>
                    renderComment({ ...reply, expanded: false }, true)
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <VideoCommentsSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (commentsDisabled || comments.length === 0) {
    return <NoComments />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{comments.length} Comments</h2>
        <Select
          onValueChange={(value) => sortComments(value as "top" | "newest")}
          defaultValue={sortBy}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort comments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top comments</SelectItem>
            <SelectItem value="newest">Newest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {comments.map((comment) => renderComment(comment))}
    </div>
  );
};

export default VideoComments;

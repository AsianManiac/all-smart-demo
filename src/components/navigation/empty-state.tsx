import { MessageSquareOff, VideoOff } from "lucide-react";
import { EmptyState } from "./api-state";

export function NoComments() {
  return (
    <EmptyState
      title="No Comments Available"
      description="Comments are either disabled for this video or none have been posted yet."
      icon={
        <MessageSquareOff className="h-10 w-10 text-muted-foreground mb-4" />
      }
      className="mt-4"
    />
  );
}

interface NoVideosProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export function NoVideos({
  title = "No Videos Found",
  description = "We couldn't find any videos matching your criteria.",
  onRefresh,
}: NoVideosProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<VideoOff className="h-10 w-10 text-muted-foreground mb-4" />}
      action={
        onRefresh
          ? {
              label: "Refresh",
              onClick: onRefresh,
            }
          : undefined
      }
      className="mt-4"
    />
  );
}

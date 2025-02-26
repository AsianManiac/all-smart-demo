import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/video";
import { RecommendedVideo } from "@/types";
import { PlayCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ErrorState } from "./navigation/api-state";
import { NoVideos } from "./navigation/empty-state";
import { RecommendedVideosSkeleton } from "./skeleton-loaders";

interface RecommendedVideosProps {
  videos: RecommendedVideo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
}

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({
  videos,
  isLoading = false,
  isError = false,
  error = null,
  isEmpty = false,
  onRetry,
}) => {
  if (isLoading) {
    return <RecommendedVideosSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (isEmpty || videos.length === 0) {
    return (
      <NoVideos
        title="No Recommended Videos"
        description="We couldn't find any recommended videos at this time."
        onRefresh={onRetry}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold mb-4 text-xl">Recommended Videos</h2>
      {videos.slice(2, 15).map((video) => (
        <Link
          to={`/shows/${video.id}`}
          key={video.id}
          className="flex gap-2 group cursor-pointer"
        >
          <div className="relative flex-shrink-0">
            <img
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              className="w-40 h-24 object-cover rounded-lg"
            />
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
              {video.duration}
            </div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold md:text-base line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={video.channel.avatar}
                  alt={video.channel.name}
                />
                <AvatarFallback>
                  {video.channel.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">
                {video.channel.name}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{formatNumber(video.views)} views</span>
              <span>•</span>
              <span>{video.publishedAt}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedVideos;

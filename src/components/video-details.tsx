import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseTimestamps } from "@/lib/utils";
import { formatLink, formatNumber } from "@/lib/video";
import type { VideoMetadata } from "@/types";
import { MessageCircle, ThumbsUp } from "lucide-react";
import type React from "react";
import { ErrorState } from "./navigation/api-state";
import { NoVideos } from "./navigation/empty-state";
import { VideoDetailsSkeleton } from "./skeleton-loaders";

interface VideoDetailsProps {
  videoData: VideoMetadata | null;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onTimestampClick: (seconds: number) => void;
  onRetry?: () => void;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({
  videoData,
  isLoading = false,
  isError = false,
  error = null,
  onTimestampClick,
  onRetry,
}) => {
  const renderDescription = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(\w+)/g;
    const timestamps = parseTimestamps(text);

    return text.split("\n").map((line, i) => {
      let processedLine = line;

      // Process timestamps
      timestamps.forEach(({ seconds, label }) => {
        const timestampRegex = new RegExp(
          `(\$$)?(?:⌨️\\s*)?(\\d{1,2}:)?(\\d{1,2}):(\\d{2})(\$$)?\\s*${label}`,
          "g"
        );
        processedLine = processedLine.replace(
          timestampRegex,
          (match, openParen, hours, minutes, secs, closeParen) => {
            const formattedTime = hours
              ? `${hours}${minutes}:${secs}`
              : `${minutes}:${secs}`;
            return `<span class="text-primary ${match} font-normal hover:underline align-top tracking-tight cursor-pointer" data-timestamp="${seconds}">${
              openParen || ""
            }${formattedTime}</span>${closeParen || ""} ${label}`;
          }
        );
      });

      // Process URLs
      processedLine = processedLine.replace(
        urlRegex,
        (url) =>
          `<a href="${url}" class="text-blue-500 hover:underline">${formatLink(
            url
          )}</a>`
      );

      // Process hashtags
      processedLine = processedLine.replace(
        hashtagRegex,
        '<a href="/hashtag/$1" class="text-blue-500 hover:underline">#$1</a>'
      );

      return (
        <p
          key={i}
          className="timestamp"
          dangerouslySetInnerHTML={{ __html: processedLine }}
          onClick={(e) => handleTimestampClick(e)}
        />
      );
    });
  };

  const handleTimestampClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "SPAN" && target.dataset.timestamp) {
      const seconds = Number.parseInt(target.dataset.timestamp, 10);
      onTimestampClick(seconds);
    }
  };

  if (isLoading) {
    return <VideoDetailsSkeleton />;
  }

  if (videoData === null) {
    return <NoVideos />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{videoData.title}</h1>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={videoData.channel.avatar}
              alt={videoData.channel.name}
            />
            <AvatarFallback>
              {videoData.channel.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm md:text-base">
              {videoData.channel.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {videoData.channel.subscribers} subscribers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            {formatNumber(videoData.likes)}
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {videoData.comments.length}
          </Button>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">
            {formatNumber(videoData.views)} views
          </span>
          <span>•</span>
          <span>{videoData.publishedAt}</span>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {renderDescription(videoData.description)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default VideoDetails;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/video";
import type { RecommendedVideo } from "@/types";
import { Calendar, Clock, Heart, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

export type ShowStatus = "live" | "upcoming" | "completed" | "new" | "trending";

interface ShowCardProps {
  show: RecommendedVideo & {
    day?: string;
    time?: string;
    status?: ShowStatus;
    type?: string;
  };
  variant?: "default" | "horizontal" | "featured";
  showActions?: boolean;
  onRemind?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

export function ShowCard({
  show,
  variant = "default",
  showActions = true,
  onRemind,
  onFavorite,
}: ShowCardProps) {
  const isHorizontal = variant === "horizontal";
  const isFeatured = variant === "featured";

  const statusColors = {
    live: "bg-red-500",
    upcoming: "bg-blue-500",
    completed: "bg-green-500",
    new: "bg-purple-500",
    trending: "bg-amber-500",
  };

  const statusLabels = {
    live: "LIVE NOW",
    upcoming: "UPCOMING",
    completed: "WATCH AGAIN",
    new: "NEW",
    trending: "TRENDING",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        isHorizontal ? "flex flex-col md:flex-row" : "flex flex-col",
        isFeatured && "border-primary/20"
      )}
    >
      <div
        className={cn(
          "relative",
          isHorizontal ? "md:w-1/3" : "w-full",
          isFeatured && "aspect-[16/9]"
        )}
      >
        <img
          src={show.allThumbnails?.medium?.url || "/placeholder.svg"}
          alt={show.title}
          className="w-full h-full object-cover aspect-video"
        />

        {show.status && (
          <div
            className={cn(
              "absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded",
              statusColors[show.status]
            )}
          >
            {statusLabels[show.status]}
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
          {show.duration}
        </div>

        <Link
          to={`/shows/${show.id}`}
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
        >
          <PlayCircle
            className={cn(
              "text-white transition-transform duration-300",
              isFeatured ? "w-16 h-16" : "w-12 h-12",
              "hover:scale-110"
            )}
          />
        </Link>
      </div>

      <div
        className={cn(
          "p-4 flex flex-col",
          isHorizontal ? "md:w-2/3" : "w-full",
          isFeatured && "space-y-3"
        )}
      >
        <div>
          <Link to={`/shows/${show.id}`}>
            <h3
              className={cn(
                "font-semibold hover:text-primary transition-colors line-clamp-2",
                isFeatured && "text-xl"
              )}
            >
              {show.title}
            </h3>
          </Link>

          {show.channel && (
            <p className="text-sm text-muted-foreground mt-1">
              {show.channel.name}
            </p>
          )}
        </div>

        {(show.day || show.time) && (
          <div className="flex items-center gap-2 text-sm mt-2">
            {show.day && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{show.day}</span>
              </div>
            )}
            {show.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{show.time}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          {show.type && <Badge variant="outline">{show.type}</Badge>}
          <span className="text-xs text-muted-foreground ml-auto">
            {formatNumber(show.views)} views
          </span>
        </div>

        {showActions && (
          <div className={cn("flex gap-2 mt-auto pt-3", isFeatured && "pt-4")}>
            {show.status === "upcoming" && onRemind && (
              <Button
                variant="outline"
                size={isFeatured ? "default" : "sm"}
                className="flex-1"
                onClick={() => onRemind(show.id)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Remind Me
              </Button>
            )}

            {(show.status === "live" || show.status === "completed") && (
              <Button
                variant={show.status === "live" ? "default" : "secondary"}
                size={isFeatured ? "default" : "sm"}
                className="flex-1"
                asChild
              >
                <Link to={`/shows/${show.id}`}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {show.status === "live" ? "Watch Now" : "Watch"}
                </Link>
              </Button>
            )}

            {onFavorite && (
              <Button
                variant="ghost"
                size={isFeatured ? "default" : "sm"}
                onClick={() => onFavorite(show.id)}
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export function ShowCardSkeleton({ variant = "default" }) {
  const isHorizontal = variant === "horizontal";

  return (
    <Card
      className={cn(
        "overflow-hidden",
        isHorizontal ? "flex flex-col md:flex-row" : "flex flex-col"
      )}
    >
      <div className={isHorizontal ? "md:w-1/3" : "w-full"}>
        <Skeleton className="w-full aspect-video" />
      </div>

      <div
        className={cn(
          "p-4 flex flex-col",
          isHorizontal ? "md:w-2/3" : "w-full"
        )}
      >
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />

        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16 ml-auto" />
        </div>

        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

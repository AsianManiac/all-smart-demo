import RecommendedVideos from "@/components/recommended-videos";
import { Skeleton } from "@/components/ui/skeleton";
import VideoComments from "@/components/video-comments";
import VideoDetails from "@/components/video-details";
import { getRecommendedVideos, getVideoMetadata } from "@/lib/video";
import type { RecommendedVideo, VideoMetadata } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

export default function ViewShow() {
  const { showId } = useParams<{ showId: string }>();
  const [playing, setPlaying] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<
    RecommendedVideo[]
  >([]);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = `https://www.youtube.com/watch?v=${showId}`;
  // const videoUrl = "https://www.youtube.com/watch?v=iu-LBY7NXD4";

  const recommendedUrls = [
    "https://www.youtube.com/watch?v=NqzdVN2tyvQ",
    "https://www.youtube.com/watch?v=Cbi9IrJYnk0",
    "https://www.youtube.com/watch?v=5yEG6GhoJBs",
    "https://www.youtube.com/watch?v=HQm5i_LemAU",
    "https://www.youtube.com/watch?v=HIj8wU_rGIU",
    "https://www.youtube.com/watch?v=eMBB8OK50tw",
    "https://www.youtube.com/watch?v=0ZJgIjIuY7U",
    "https://www.youtube.com/watch?v=b6VnWy-jjAM",
    "https://www.youtube.com/watch?v=2CJglIAkHc0",
    "https://www.youtube.com/watch?v=ekO7S3hu8gM",
    "https://www.youtube.com/watch?v=TNhaISOUy6Q",
    "https://www.youtube.com/watch?v=ZeNyjnneq_w",
    "https://www.youtube.com/watch?v=AYBuL8FhgwA",
    "https://www.youtube.com/watch?v=cc_xmawJ8Kg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const metadata = await getVideoMetadata(videoUrl);
        const recommended = await getRecommendedVideos(recommendedUrls);
        setVideoData(metadata);
        setRecommendedVideos(recommended);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [videoUrl]);

  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ReactPlayer
                  ref={playerRef}
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  playing={playing}
                  controls
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              )}
            </div>

            <div className="mt-4 space-y-4">
              {loading ? (
                <VideoDetailsSkeleton />
              ) : (
                videoData && (
                  <VideoDetails
                    videoData={videoData}
                    onTimestampClick={handleTimestampClick}
                  />
                )
              )}
              <div className="shrink-0 bg-border h-[1px] w-full" />
              {loading ? (
                <CommentsSkeleton />
              ) : (
                videoData && <VideoComments comments={videoData.comments} />
              )}
            </div>
          </div>

          {/* Recommended Videos */}
          <div className="lg:col-span-1">
            {loading ? (
              <RecommendedVideosSkeleton />
            ) : (
              <RecommendedVideos videos={recommendedVideos} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const VideoDetailsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24 mt-1" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
    <Skeleton className="h-40 w-full" />
  </div>
);

const CommentsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-8 w-32" />
    </div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full mt-1" />
          <Skeleton className="h-3 w-3/4 mt-1" />
        </div>
      </div>
    ))}
  </div>
);

const RecommendedVideosSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-48" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-2">
        <Skeleton className="w-40 h-24 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

import RecommendedVideos from "@/components/recommended-videos";
import VideoComments from "@/components/video-comments";
import VideoDetails from "@/components/video-details";
import { getRecommendedVideos, getVideoMetadata } from "@/lib/video";
import type { RecommendedVideo, VideoMetadata } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<
    RecommendedVideo[]
  >([]);
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = "https://www.youtube.com/watch?v=NqzdVN2tyvQ";
  // const videoUrl = "https://www.youtube.com/watch?v=iu-LBY7NXD4";

  const recommendedUrls = [
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
      const metadata = await getVideoMetadata(videoUrl);
      const recommended = await getRecommendedVideos(recommendedUrls);
      setVideoData(metadata);
      setRecommendedVideos(recommended);
    };
    fetchData();
  }, [videoUrl]);

  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  if (!videoData) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
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
            </div>

            <div className="mt-4 space-y-4">
              <VideoDetails
                videoData={videoData}
                onTimestampClick={handleTimestampClick}
              />
              <div className="shrink-0 bg-border h-[1px] w-full" />
              <VideoComments comments={videoData.comments} />
            </div>
          </div>

          {/* Recommended Videos */}
          <div className="lg:col-span-1">
            <RecommendedVideos videos={recommendedVideos} />
          </div>
        </div>
      </div>
    </div>
  );
}

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import RecommendedVideos from "@/components/recommended-videos";
import { Skeleton } from "@/components/ui/skeleton";
import VideoComments from "@/components/video-comments";
import VideoDetails from "@/components/video-details";
import {
  getChannelVideos,
  getRecommendedVideos,
  getVideoMetadata,
} from "@/lib/video";
import type { RecommendedVideo, VideoMetadata } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
// @DaveGrayTeachesCode
export default function ViewShow() {
  const { showId } = useParams<{ showId: string }>();
  const [playing, setPlaying] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<
    RecommendedVideo[]
  >([]);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = `https://www.youtube.com/watch?v=${showId}`;
  // const videoUrl = "https://www.youtube.com/watch?v=iu-LBY7NXD4";

  const recommendedUrls = [
    "https://www.youtube.com/watch?v=fum_mMfKftg",
    "https://www.youtube.com/watch?v=4DvgJOL_E3I",
    "https://www.youtube.com/watch?v=J5ROH_QTDO4",
    "https://www.youtube.com/watch?v=A1aNjrDoHoo",
    "https://www.youtube.com/watch?v=fmIS-xvdPcI",
    "https://www.youtube.com/watch?v=gYMPe68a1lE",
    "https://www.youtube.com/watch?v=aNWbJ99I7es",
    "https://www.youtube.com/watch?v=AdUcYgiAKQU",
    "https://www.youtube.com/watch?v=W5-Td8UcWBw",
    "https://www.youtube.com/watch?v=aYBj6VwY9og",
    "https://www.youtube.com/watch?v=Uzats0OZx8I",
    "https://www.youtube.com/watch?v=1758rwDNl78",
    "https://www.youtube.com/watch?v=7-c5oZ3oaRc",
    "https://www.youtube.com/watch?v=6IwNP1fPZFA",
    "https://www.youtube.com/watch?v=Kjx991G_xgA",
    "https://www.youtube.com/watch?v=0cg2mLz_Re4",
    "https://www.youtube.com/watch?v=bPjoHiFJCak",
    "https://www.youtube.com/watch?v=pUKiCo0iD9I",
    "https://www.youtube.com/watch?v=y2ot4-n6HVs",
    "https://www.youtube.com/watch?v=pFFhkTyh52g",
    "https://www.youtube.com/watch?v=c17Sm-ISeAw",
    "https://www.youtube.com/watch?v=pAh3dfFUhJg",
    "https://www.youtube.com/watch?v=Mhbx-0dAKiQ",
    "https://www.youtube.com/watch?v=b9HQMSjhbf0",
    "https://www.youtube.com/watch?v=thaRvv1i3XI",
    "https://www.youtube.com/watch?v=SoRQPAK2jGE",
    "https://www.youtube.com/watch?v=cll6wgAyIBs",
    "https://www.youtube.com/watch?v=v97e96hON1k",
    "https://www.youtube.com/watch?v=l-7TnYigx-c",
    "https://www.youtube.com/watch?v=gXDBH7Pll-c",
    "https://www.youtube.com/watch?v=Iw2QbvpqC1s",
    "https://www.youtube.com/watch?v=tkYUupgE1YY",
    "https://www.youtube.com/watch?v=NCsqpJLECa4",
    "https://www.youtube.com/watch?v=pNvfLNztmAo",
    "https://www.youtube.com/watch?v=uU4lsTdZgyk",
    "https://www.youtube.com/watch?v=Bga83IxOGds",
    "https://www.youtube.com/watch?v=koX-MPWV1Gg",
    "https://www.youtube.com/watch?v=jopyPP6bnNQ",
    "https://www.youtube.com/watch?v=NWJTxbOUDDY",
    "https://www.youtube.com/watch?v=ojW-n3hGJM4",
    "https://www.youtube.com/watch?v=gFEpMBctHkY",
    "https://www.youtube.com/watch?v=4fscupufUrg",
    "https://www.youtube.com/watch?v=ejm1aRCmmos",
    "https://www.youtube.com/watch?v=dK7HvAF_WIY",
    "https://www.youtube.com/watch?v=6xOwVC98Cjc",
  ];

  const fetchChannels = async () => {
    try {
      await getChannelVideos("UCfbFI_j18JOonpwt35UCQOA");
    } catch (error) {
      console.error("Error fetching channel videos:", error);
    } finally {
      setLoading(false);
    }
  };
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
    fetchChannels();
  }, [videoUrl]);

  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };
  // if (loading)
  //   return (
  //     <div>
  //       <h1>{channelVideos?.channel.title}</h1>
  //       <p>{channelVideos?.channel.description}</p>
  //       <img src={channelVideos?.channel.thumbnail} alt="Channel Thumbnail" />

  //       <h2>Live Streams</h2>
  //       <ul>
  //         {channelVideos?.liveStreams.map((video) => (
  //           <li key={video.id}>
  //             <img src={video.thumbnail} alt={video.title} />
  //             <h3>{video.title}</h3>
  //             <p>{video.publishedAt}</p>
  //           </li>
  //         ))}
  //       </ul>

  //       <h2>Uploads</h2>
  //       <ul>
  //         {channelVideos?.uploads.map((video) => (
  //           <li key={video.id}>
  //             <img src={video.thumbnail} alt={video.title} />
  //             <h3>{video.title}</h3>
  //             <p>{video.publishedAt}</p>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  console.log();

  return (
    <MaxWidthWrapper className=" bg-background">
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
              <RecommendedVideosSkeleton />
            ) : (
              <RecommendedVideos videos={recommendedVideos} />
            )}
          </div>
        </div>

        {/* Recommended Videos */}
        <div className="lg:col-span-1">
          {loading ? (
            <CommentsSkeleton />
          ) : (
            videoData && <VideoComments comments={videoData.comments} />
          )}
        </div>
      </div>
    </MaxWidthWrapper>
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

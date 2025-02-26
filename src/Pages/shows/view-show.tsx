import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  ConnectionStatus,
  ErrorState,
  LoadingState,
} from "@/components/navigation/api-state";
import RecommendedVideos from "@/components/recommended-videos";
import VideoComments from "@/components/video-comments";
import VideoDetails from "@/components/video-details";
import { useRecommendedVideos, useVideoMetadata } from "@/lib/video";
import type { RecommendedVideo, VideoMetadata } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

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

interface ViewShowProps {
  isLoading?: boolean;
  isError?: boolean;
  error: CustomError | null;
  data: VideoMetadata | null;
  isEmpty: boolean;
}
interface RecommendedVideosProps {
  data: RecommendedVideo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: CustomError | null;
  isEmpty?: boolean;
}
export default function ViewShow() {
  const { showId } = useParams<{ showId: string }>();
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const videoUrl = `https://www.youtube.com/watch?v=${showId}`;
  // const videoUrl = "https://www.youtube.com/watch?v=iu-LBY7NXD4";
  const [videoState, setVideoState] = useState<ViewShowProps>({
    isLoading: true,
    isError: false,
    error: null,
    data: null,
    isEmpty: false,
  });

  const [recommendedState, setRecommendedState] =
    useState<RecommendedVideosProps>({
      isLoading: true,
      isError: false,
      error: null,
      data: [],
      isEmpty: false,
    });

  const fetchVideoData = useCallback(async () => {
    try {
      setVideoState((prev) => ({ ...prev, isLoading: true, isError: false }));
      const response = await useVideoMetadata(videoUrl);
      setVideoState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data,
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setVideoState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch video data"),
        data: null,
        isEmpty: false,
      });
    }
  }, [videoUrl]);

  const fetchRecommendedVideos = useCallback(async () => {
    try {
      setRecommendedState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
      }));
      const response = await useRecommendedVideos(recommendedUrls);
      setRecommendedState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setRecommendedState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch recommended videos"),
        data: [],
        isEmpty: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchVideoData();
    fetchRecommendedVideos();
  }, [videoUrl, fetchVideoData, fetchRecommendedVideos]);

  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  if (videoState.isError && recommendedState.isError) {
    return (
      <MaxWidthWrapper className="py-10">
        <div className="flex justify-end mb-4">
          <ConnectionStatus />
        </div>
        <ErrorState
          error={videoState.error || new Error("Failed to load content")}
          onRetry={() => {
            fetchVideoData();
            fetchRecommendedVideos();
          }}
          className="mb-6"
        />
      </MaxWidthWrapper>
    );
  }
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
  // console.log();

  return (
    <MaxWidthWrapper className=" bg-background">
      <div className="flex justify-end py-2">
        <ConnectionStatus />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {videoState.isLoading ? (
              <LoadingState message="Loading video..." className="h-full" />
            ) : videoState.isError ? (
              <ErrorState
                error={videoState.error}
                onRetry={fetchVideoData}
                className="h-full flex items-center justify-center"
              />
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
            <VideoDetails
              videoData={videoState.data}
              isLoading={videoState.isLoading}
              isError={videoState.isError}
              error={videoState.error}
              onTimestampClick={handleTimestampClick}
              onRetry={fetchVideoData}
            />

            <div className="shrink-0 bg-border h-[1px] w-full" />
            <RecommendedVideos
              videos={recommendedState.data || []}
              isLoading={recommendedState.isLoading}
              isError={recommendedState.isError}
              error={recommendedState.error}
              isEmpty={recommendedState.isEmpty}
              onRetry={fetchRecommendedVideos}
            />
          </div>
        </div>

        {/* Recommended Videos */}
        <div className="lg:col-span-1">
          <VideoComments
            comments={videoState.data?.comments!}
            isLoading={videoState.isLoading}
            isError={
              videoState.isError &&
              videoState.error?.cause?.code === "COMMENTS_DISABLED"
            }
            error={
              videoState.isError &&
              videoState.error?.cause?.code === "COMMENTS_DISABLED"
                ? videoState.error
                : null
            }
            commentsDisabled={videoState.data?.commentsDisabled}
            onRetry={fetchVideoData}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

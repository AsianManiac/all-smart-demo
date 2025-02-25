import { formatDuration } from "@/lib/utils";
import axios from "axios";
import type React from "react";
import { useState } from "react";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY; // Replace with your actual API key
const API_URL = "https://www.googleapis.com/youtube/v3";

interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: string;
  publishedAt: string;
  replies?: Comment[];
}

const YoutubeVideoInfo: React.FC = () => {
  const [videoUrls, setVideoUrls] = useState<string>("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState([]);

  const extractVideoIds = (urls: string): string[] => {
    const urlList = urls.split("\n").filter((url) => url.trim() !== "");
    return urlList
      .map((url) => {
        const match = url.match(
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
        );
        return match ? match[1] : "";
      })
      .filter((id) => id !== "");
  };

  const fetchVideoInfo = async () => {
    setIsLoading(true);
    setError(null);
    const videoIds = extractVideoIds(videoUrls);

    try {
      const videoDetailsPromises = videoIds.map((id) =>
        axios.get(`${API_URL}/videos`, {
          params: {
            part: "snippet,statistics,contentDetails",
            id: id,
            key: API_KEY,
          },
        })
      );

      const commentThreadsPromises = videoIds.map((id) =>
        axios.get(`${API_URL}/commentThreads`, {
          params: {
            part: "snippet,replies",
            videoId: id,
            key: API_KEY,
          },
        })
      );

      const [videoDetailsResponses, commentThreadsResponses] =
        await Promise.all([
          Promise.all(videoDetailsPromises),
          Promise.all(commentThreadsPromises),
        ]);

      const fetchedVideoInfo: VideoInfo[] = videoDetailsResponses.map(
        (response, index) => {
          const videoData = response.data.items[0];
          const commentThreads = commentThreadsResponses[index].data.items;

          const comments: Comment[] = commentThreads.map((thread: any) => ({
            id: thread.id,
            author: thread.snippet.topLevelComment.snippet.authorDisplayName,
            authorProfileImageUrl:
              thread.snippet.topLevelComment.snippet.authorProfileImageUrl,
            textDisplay: thread.snippet.topLevelComment.snippet.textDisplay,
            likeCount: thread.snippet.topLevelComment.snippet.likeCount,
            publishedAt: thread.snippet.topLevelComment.snippet.publishedAt,
            replies: thread.replies
              ? thread.replies.comments.map((reply: any) => ({
                  id: reply.id,
                  author: reply.snippet.authorDisplayName,
                  authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
                  textDisplay: reply.snippet.textDisplay,
                  likeCount: reply.snippet.likeCount,
                  publishedAt: reply.snippet.publishedAt,
                }))
              : undefined,
          }));
          setData(videoData);

          return {
            id: videoData.id,
            title: videoData.snippet.title,
            description: videoData.snippet.description,
            thumbnailUrl: videoData.snippet.thumbnails.default.url,
            viewCount: videoData.statistics.viewCount,
            likeCount: videoData.statistics.likeCount,
            duration: formatDuration(videoData.contentDetails.duration),
            comments: comments,
          };
        }
      );

      setVideoInfo(fetchedVideoInfo);
    } catch (err) {
      setError(
        "Error fetching video information. Please check your API key and video URLs."
      );
      console.error("Error fetching video information:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Video Info Fetcher</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={5}
        placeholder="Enter YouTube video URLs (one per line)"
        value={videoUrls}
        onChange={(e) => setVideoUrls(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={fetchVideoInfo}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Fetch Video Info"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        {videoInfo.map((video) => (
          <div key={video.id} className="mb-6 p-4 border rounded">
            <h2 className="text-xl font-semibold">{video.title}</h2>
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              className="my-2"
            />
            <p className="text-gray-600 mb-2">{video.description}</p>
            <p>Views: {video.viewCount}</p>
            <p>Likes: {video.likeCount}</p>
            <p>Duration: {video.duration}</p>
            <h3 className="text-lg font-semibold mt-4">Comments:</h3>
            {video.comments.map((comment) => (
              <div key={comment.id} className="mt-2 border-t pt-2">
                <div className="flex items-center">
                  <img
                    src={comment.authorProfileImageUrl || "/placeholder.svg"}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="font-semibold">{comment.author}</span>
                </div>
                <p>{comment.textDisplay}</p>
                <p className="text-sm text-gray-500">
                  Likes: {comment.likeCount}
                </p>
                {comment.replies && (
                  <div className="ml-8 mt-2">
                    <h4 className="text-sm font-semibold">Replies:</h4>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="mt-2 border-t pt-2">
                        <div className="flex items-center">
                          <img
                            src={
                              reply.authorProfileImageUrl || "/placeholder.svg"
                            }
                            alt={reply.author}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="font-semibold">{reply.author}</span>
                        </div>
                        <p>{reply.textDisplay}</p>
                        <p className="text-sm text-gray-500">
                          Likes: {reply.likeCount}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <pre className="max-w-md">{JSON.stringify(data, undefined, 2)}</pre>
    </div>
  );
};

export default YoutubeVideoInfo;

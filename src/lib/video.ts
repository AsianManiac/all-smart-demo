import { formatDuration } from "@/lib/utils";
import type { ChannelVideos, RecommendedVideo, VideoMetadata } from "@/types";
import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;
const API_URL = "https://www.googleapis.com/youtube/v3";

// Fetch channel information and videos
export async function getChannelVideos(
  channelId: string
): Promise<ChannelVideos> {
  try {
    // Fetch channel details to get the uploads playlist ID
    const channelResponse = await axios.get(`${API_URL}/channels`, {
      params: {
        part: "snippet,contentDetails",
        id: channelId,
        key: API_KEY,
      },
    });

    const channelData = channelResponse.data.items[0];
    const uploadsPlaylistId =
      channelData.contentDetails.relatedPlaylists.uploads;

    // Fetch all videos from the uploads playlist
    const uploadsResponse = await axios.get(`${API_URL}/playlistItems`, {
      params: {
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: 50, // Adjust as needed
        key: API_KEY,
      },
    });

    const uploads = uploadsResponse.data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));

    // Fetch live streams using the search endpoint
    const liveStreamsResponse = await axios.get(`${API_URL}/search`, {
      params: {
        part: "snippet",
        channelId: channelId,
        eventType: "live",
        type: "video",
        maxResults: 50, // Adjust as needed
        key: API_KEY,
      },
    });

    const liveStreams = liveStreamsResponse.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));

    return {
      channel: {
        id: channelId,
        title: channelData.snippet.title,
        description: channelData.snippet.description,
        thumbnail: channelData.snippet.thumbnails.default.url,
        subscriberCount: channelData.statistics?.subscriberCount || "N/A",
      },
      uploads,
      liveStreams,
    };
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    throw error;
  }
}

export async function getVideoMetadata(url: string): Promise<VideoMetadata> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  try {
    const [videoResponse, commentThreadsResponse] = await Promise.all([
      axios.get(`${API_URL}/videos`, {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoId,
          key: API_KEY,
        },
      }),
      axios.get(`${API_URL}/commentThreads`, {
        params: {
          part: "snippet,replies",
          videoId: videoId,
          key: API_KEY,
        },
      }),
    ]);

    const videoData = videoResponse.data.items[0];
    const commentThreads = commentThreadsResponse.data.items;

    return {
      id: videoId,
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      views: videoData.statistics.viewCount,
      publishedAt: new Date(videoData.snippet.publishedAt).toLocaleDateString(),
      likes: videoData.statistics.likeCount,
      duration: formatDuration(videoData.contentDetails.duration),
      channel: {
        name: videoData.snippet.channelTitle,
        subscribers: "N/A", // You'd need an additional API call to get this
        avatar: videoData.snippet.thumbnails.default.url,
      },
      hashtags: videoData.snippet.tags || [],
      comments: commentThreads.map((thread: any) => ({
        id: thread.id,
        author: thread.snippet.topLevelComment.snippet.authorDisplayName,
        authorProfileImageUrl:
          thread.snippet.topLevelComment.snippet.authorProfileImageUrl,
        textDisplay: thread.snippet.topLevelComment.snippet.textDisplay,
        likeCount: thread.snippet.topLevelComment.snippet.likeCount,
        publishedAt: new Date(
          thread.snippet.topLevelComment.snippet.publishedAt
        ).toLocaleDateString(),
        replies: thread.replies
          ? thread.replies.comments.map((reply: any) => ({
              id: reply.id,
              author: reply.snippet.authorDisplayName,
              authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
              textDisplay: reply.snippet.textDisplay,
              likeCount: reply.snippet.likeCount,
              publishedAt: new Date(
                reply.snippet.publishedAt
              ).toLocaleDateString(),
            }))
          : undefined,
      })),
    };
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    throw error;
  }
}

export async function getRecommendedVideos(
  urls: string[]
): Promise<RecommendedVideo[]> {
  const videoIds = urls.map(extractVideoId).filter(Boolean);

  try {
    const response = await axios.get(`${API_URL}/videos`, {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoIds.join(","),
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      allThumbnails: item.snippet.thumbnails,
      duration: formatDuration(item.contentDetails.duration),
      channel: {
        name: item.snippet.channelTitle,
        avatar: item.snippet.thumbnails.default.url,
      },
      views: item.statistics.viewCount,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching recommended videos:", error);
    throw error;
  }
}

export function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function formatNumber(num: string): string {
  const n = Number.parseInt(num.replace(/,/g, ""));
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + "M";
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + "K";
  }
  return num;
}

export function formatLink(text: string, maxLength = 50): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

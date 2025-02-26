import {
  createInitialState,
  handleApiError,
  showErrorToast,
} from "@/components/navigation/api-state";
import { formatDuration } from "@/lib/utils";
import type { ChannelVideos, RecommendedVideo, VideoMetadata } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_KEY;
const API_URL =
  import.meta.env.VITE_YOUTUBE_DATA_API_URL ??
  "https://www.googleapis.com/youtube/v3";

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
        subscribers: "N/A", // I need an additional API call to get this
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

/**
 * Fetch channel information and videos with state management
 * @param channelId string
 * @returns Promise<ApiResponse<ChannelVideos>>
 */
export async function useChannelVideos(
  channelId: string
): Promise<ApiResponse<ChannelVideos>> {
  const state = createInitialState<ChannelVideos>();

  const fetchData = async () => {
    state.isLoading = true;
    state.isError = false;
    state.error = null;

    try {
      // Fetch channel details to get the uploads playlist ID
      const channelResponse = await axios.get(`${API_URL}/channels`, {
        params: {
          part: "snippet,contentDetails,statistics",
          id: channelId,
          key: API_KEY,
        },
      });

      if (
        !channelResponse.data.items ||
        channelResponse.data.items.length === 0
      ) {
        state.isEmpty = true;
        state.isLoading = false;
        return;
      }

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
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
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
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
      }));

      state.data = {
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

      state.isEmpty = uploads.length === 0 && liveStreams.length === 0;
    } catch (error) {
      const processedError = handleApiError(error);
      state.isError = true;
      state.error = processedError;
      showErrorToast(processedError);
    } finally {
      state.isLoading = false;
    }
  };

  await fetchData();

  return {
    ...state,
    refetch: fetchData,
  };
}

/**
 *
 * @param url string
 * @returns Promise<ApiResponse<VideoMetadata>>
 */
export async function useVideoMetadata(
  url: string
): Promise<ApiResponse<VideoMetadata>> {
  const state = createInitialState<VideoMetadata>();

  const fetchData = async () => {
    state.isLoading = true;
    state.isError = false;
    state.error = null;

    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        const customError: CustomError = new Error("Invalid YouTube URL");
        customError.cause = {
          code: "INVALID_URL",
          message: "The provided URL is not a valid YouTube video URL.",
        };
        throw customError;
      }

      const [videoResponse, commentThreadsResponse] = await Promise.all([
        axios.get(`${API_URL}/videos`, {
          params: {
            part: "snippet,statistics,contentDetails",
            id: videoId,
            key: API_KEY,
          },
        }),
        axios
          .get(`${API_URL}/commentThreads`, {
            params: {
              part: "snippet,replies",
              videoId: videoId,
              key: API_KEY,
            },
          })
          .catch((error) => {
            // Handle comments disabled case
            if (
              error?.response?.data?.error?.errors?.[0]?.reason ===
              "commentsDisabled"
            ) {
              return { data: { items: [] } };
            }
            throw error;
          }),
      ]);

      if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
        state.isEmpty = true;
        state.isLoading = false;
        return;
      }

      const videoData = videoResponse.data.items[0];
      const commentThreads = commentThreadsResponse.data.items || [];

      state.data = {
        id: videoId,
        title: videoData.snippet.title,
        description: videoData.snippet.description,
        views: videoData.statistics.viewCount,
        publishedAt: new Date(
          videoData.snippet.publishedAt
        ).toLocaleDateString(),
        likes: videoData.statistics.likeCount,
        duration: formatDuration(videoData.contentDetails.duration),
        channel: {
          name: videoData.snippet.channelTitle,
          subscribers: "N/A", // I need an additional API call to get this
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
        commentsDisabled: commentThreads.length === 0,
      };

      state.isEmpty = false;
    } catch (error) {
      const processedError = handleApiError(error);
      state.isError = true;
      state.error = processedError;
      showErrorToast(processedError);
    } finally {
      state.isLoading = false;
    }
  };

  await fetchData();

  return {
    ...state,
    refetch: fetchData,
  };
}

/**
 *
 * @param urls string[]
 * @returns Promise<ApiResponse<RecommendedVideo[]>>
 */
export async function useRecommendedVideos(
  urls: string[]
): Promise<ApiResponse<RecommendedVideo[]>> {
  const state = createInitialState<RecommendedVideo[]>();
  // console.log("STATE_DATA::", state);

  const fetchData = async () => {
    state.isLoading = true;
    state.isError = false;
    state.error = null;

    try {
      const videoIds = urls.map(extractVideoId).filter(Boolean);

      if (videoIds.length === 0) {
        state.isEmpty = true;
        state.isLoading = false;
        return;
      }

      const response = await axios.get(`${API_URL}/videos`, {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoIds.join(","),
          key: API_KEY,
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        state.isEmpty = true;
        state.isLoading = false;
        return;
      }

      state.data = response.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        allThumbnails: item.snippet.thumbnails,
        duration: formatDuration(item.contentDetails.duration),
        channel: {
          name: item.snippet.channelTitle,
          avatar: item.snippet.thumbnails.default.url,
        },
        views: item.statistics.viewCount,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      }));

      state.isEmpty = state?.data?.length === 0;
    } catch (error) {
      const processedError = handleApiError(error);
      state.isError = true;
      state.error = processedError;
      showErrorToast(processedError);
    } finally {
      state.isLoading = false;
    }
  };

  await fetchData();

  return {
    ...state,
    refetch: fetchData,
  };
}

// Generic state interface for data fetching
export interface FetchState<T> {
  isLoading: boolean;
  isError: boolean;
  error: CustomError | null;
  data: T | null;
  isEmpty: boolean;
}

// Initial state for data fetching
export const initialFetchState = <T>(): FetchState<T> => ({
  isLoading: true,
  isError: false,
  error: null,
  data: null,
  isEmpty: false,
});

export function useFetch<T>(
  fetchFn: () => Promise<FetchState<T>>,
  dependencies: any[] = []
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>(initialFetchState<T>());

  const fetchData = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
      data: null,
      isEmpty: false,
    }));
    try {
      const result = await fetchFn();
      setState(result);
    } catch (error) {
      console.error("Error in useFetch:", error);

      let customError: CustomError;
      if (error instanceof CustomError) {
        customError = error;
      } else if (error instanceof Error) {
        customError = new CustomError(error.message, "FETCH_ERROR", error);
      } else {
        customError = new CustomError(
          "An unknown error occurred",
          "UNKNOWN_ERROR"
        );
      }

      setState({
        isLoading: false,
        isError: true,
        error: customError,
        data: null,
        isEmpty: true,
      });

      // Show toast notification for the error
      toast("Error", {
        description: customError.message,
      });
    }
  }, [fetchFn, setState]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Custom error class with additional metadata
export class CustomError extends Error {
  cause?: {
    code: string;
    message: string;
  };

  constructor(message: string, code?: string, originalError?: unknown) {
    super(message);
    this.name = "CustomError";

    if (code) {
      this.cause = {
        code,
        message: message,
      };
    }

    // Capture original error info if available
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
      if (!this.cause) {
        this.cause = {
          code: "UNKNOWN_ERROR",
          message: originalError.message,
        };
      }
    }
  }
}

//

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  views: string;
  publishedAt: string;
  duration: any;
  likes: string;
  channel: {
    name: string;
    subscribers: string;
    avatar: string;
  };
  hashtags: string[];
  comments: Comment[];
}

export interface Comment {
  likeCount: string;
  textDisplay: string;
  publishedAt: any;
  authorProfileImageUrl: string;
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: string;
  timestamp: string;
  replies?: Comment[];
  expanded?: boolean;
  showReplies?: boolean;
}

export interface RecommendedVideo {
  id: string;
  title: string;
  thumbnail: string;
  allThumbnails: {
    default: {
      url: string;
      width: number;
      height: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
    };
    high: {
      url: string;
      width: number;
      height: number;
    };
    standard: {
      url: string;
      width: number;
      height: number;
    };
    maxres: {
      url: string;
      width: number;
      height: number;
    };
  };
  duration: string;
  channel: {
    name: string;
    avatar: string;
  };
  views: string;
  publishedAt: string;
}

export interface ChannelVideos {
  channel: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    subscriberCount: string;
  };
  uploads: {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
  }[];
  liveStreams: {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
  }[];
}

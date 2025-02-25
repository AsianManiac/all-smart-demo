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
  likeCount: number;
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
}

export interface RecommendedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: {
    name: string;
    avatar: string;
  };
  views: string;
  publishedAt: string;
}

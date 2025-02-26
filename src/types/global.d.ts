declare type ApiState<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isEmpty: boolean;
};

declare type ApiResponse<T> = ApiState<T> & {
  refetch: () => Promise<void>;
};

declare interface CustomError extends Error {
  cause?: {
    code:
      | "QUOTA_EXCEEDED"
      | "COMMENTS_DISABLED"
      | "NETWORK_ERROR"
      | "VIDEO_NOT_FOUND"
      | "INVALID_URL"
      | "UNKNOWN_ERROR";
    message: string;
  };
}

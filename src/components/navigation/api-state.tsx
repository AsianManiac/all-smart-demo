import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  ServerCrash,
  ThumbsDown,
  Wifi,
  WifiOff,
} from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";

export function createInitialState<T>(): ApiState<T> {
  return {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    isEmpty: false,
  };
}

export function handleApiError(error: any): CustomError {
  // Check if it's a YouTube API quota exceeded error
  if (error?.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
    const customError: CustomError = new Error(
      "YouTube API quota exceeded. Please try again later."
    );
    customError.cause = {
      code: "QUOTA_EXCEEDED",
      message: "You've reached the YouTube API quota limit for today.",
    };
    return customError;
  }

  // Check if it's a comments disabled error
  if (
    error?.response?.data?.error?.errors?.[0]?.reason === "commentsDisabled"
  ) {
    const customError: CustomError = new Error(
      "Comments are disabled for this video."
    );
    customError.cause = {
      code: "COMMENTS_DISABLED",
      message: "The video owner has disabled comments for this video.",
    };
    return customError;
  }

  // Check for network errors
  if (error.message === "Network Error" || !navigator.onLine) {
    const customError: CustomError = new Error(
      "Network connection error. Please check your internet connection."
    );
    customError.cause = {
      code: "NETWORK_ERROR",
      message:
        "Unable to connect to the server. Check your internet connection.",
    };
    return customError;
  }

  // Check for invalid video ID
  if (error?.response?.data?.error?.errors?.[0]?.reason === "videoNotFound") {
    const customError: CustomError = new Error(
      "Video not found. The video may have been removed or is private."
    );
    customError.cause = {
      code: "VIDEO_NOT_FOUND",
      message: "The requested video could not be found.",
    };
    return customError;
  }

  // Default error
  const customError: CustomError = new Error(
    error.message || "An unexpected error occurred"
  );
  customError.cause = {
    code: "UNKNOWN_ERROR",
    message: error.message || "Something went wrong. Please try again later.",
  };
  return customError;
}

export function showErrorToast(error: CustomError) {
  const cause = error.cause as { code: string; message: string } | undefined;

  toast.error(error.message, {
    description: cause?.message || "Please try again later",
    action: {
      label: "Dismiss",
      onClick: () => {},
    },
  });
}

interface ErrorStateProps {
  error: CustomError | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const cause = error?.cause as { code: string; message: string } | undefined;

  const getErrorIcon = (): ReactNode => {
    if (!error) return <AlertCircle className="h-10 w-10 text-destructive" />;

    switch (cause?.code) {
      case "QUOTA_EXCEEDED":
        return <ServerCrash className="h-10 w-10 text-destructive" />;
      case "COMMENTS_DISABLED":
        return <ThumbsDown className="h-10 w-10 text-destructive" />;
      case "NETWORK_ERROR":
        return <WifiOff className="h-10 w-10 text-destructive" />;
      case "VIDEO_NOT_FOUND":
        return <Search className="h-10 w-10 text-destructive" />;
      default:
        return <AlertCircle className="h-10 w-10 text-destructive" />;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        {getErrorIcon()}
        <div>
          <CardTitle>{error?.message || "An error occurred"}</CardTitle>
          <CardDescription>
            {cause?.message || "Something went wrong. Please try again."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        {icon || <Search className="h-10 w-10 text-muted-foreground mb-4" />}
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="max-w-md mb-6">
          {description}
        </CardDescription>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 ${className}`}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function SuccessState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}

export function ConnectionStatus() {
  const isOnline = navigator.onLine;
  return (
    <div
      className={`flex items-center gap-2 ${
        isOnline ? "text-green-600" : "text-destructive"
      }`}
    >
      {isOnline ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span className="text-sm">{isOnline ? "Connected" : "Offline"}</span>
    </div>
  );
}

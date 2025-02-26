import { Loader2 } from "lucide-react";

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({
  message = "Loading...",
}: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card shadow-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

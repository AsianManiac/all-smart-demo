import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) {
    return 0;
  }

  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(duration: string): string {
  const seconds = parseDuration(duration);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function parseTimestamps(
  description: string
): Array<{ seconds: number; label: string }> {
  const timestampRegex =
    /(?:^|\n)(?:$$)?(?:⌨️\s*)?(\d{1,2}:)?(\d{1,2}):(\d{2})(?:$$)?\s*(.*?)(?=\n|$)/g;
  const timestamps: Array<{ seconds: number; label: string }> = [];
  let match;

  while ((match = timestampRegex.exec(description)) !== null) {
    const [, hours, minutes, seconds, label] = match;
    let totalSeconds = parseInt(seconds, 10);
    totalSeconds += parseInt(minutes, 10) * 60;
    if (hours) {
      totalSeconds += parseInt(hours, 10) * 3600;
    }

    timestamps.push({
      seconds: totalSeconds,
      label: label.trim(),
    });
  }

  return timestamps;
}

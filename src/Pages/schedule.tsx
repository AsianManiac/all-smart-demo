import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRecommendedVideos } from "@/lib/video";
import type { RecommendedVideo } from "@/types";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  PlayCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SHOW_TYPES = {
  REALITY: "Reality",
  DRAMA: "Drama",
  ENTERTAINMENT: "Entertainment",
  LIFESTYLE: "Lifestyle",
};

interface Show extends RecommendedVideo {
  day: string;
  time: string;
  status: "live" | "upcoming" | "completed";
}

// YouTube video IDs for African reality TV shows
const VIDEO_IDS = [
  "https://www.youtube.com/watch?v=iu-LBY7NXD4",
  "https://www.youtube.com/watch?v=Cbi9IrJYnk0",
  "https://www.youtube.com/watch?v=5yEG6GhoJBs",
  "https://www.youtube.com/watch?v=HQm5i_LemAU",
  "https://www.youtube.com/watch?v=HIj8wU_rGIU",
  "https://www.youtube.com/watch?v=eMBB8OK50tw",
  "https://www.youtube.com/watch?v=0ZJgIjIuY7U",
  "https://www.youtube.com/watch?v=b6VnWy-jjAM",
  "https://www.youtube.com/watch?v=2CJglIAkHc0",
  "https://www.youtube.com/watch?v=ekO7S3hu8gM",
  "https://www.youtube.com/watch?v=TNhaISOUy6Q",
  "https://www.youtube.com/watch?v=ZeNyjnneq_w",
  "https://www.youtube.com/watch?v=AYBuL8FhgwA",
  "https://www.youtube.com/watch?v=cc_xmawJ8Kg",
  "https://www.youtube.com/watch?v=9G1jIV9XtLk",
  "https://www.youtube.com/watch?v=QS9ZnQKkMqc",
  "https://www.youtube.com/watch?v=3Yd_lzDYWVA",
  "https://www.youtube.com/watch?v=7Qp5vcuMIlk",
  "https://www.youtube.com/watch?v=XqZsoesa55w",
  "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  "https://www.youtube.com/watch?v=RgKAFK5djSk",
  "https://www.youtube.com/watch?v=YykjpeuMNEk",
  "https://www.youtube.com/watch?v=OPf0YbXqDm0",
  "https://www.youtube.com/watch?v=09R8_2nJtjg",
  "https://www.youtube.com/watch?v=YQHsXMglC9A",
  "https://www.youtube.com/watch?v=60ItHLz5WEA",
  "https://www.youtube.com/watch?v=fRh_vgS2dFE",
  "https://www.youtube.com/watch?v=JRfuAukYTKg",
  "https://www.youtube.com/watch?v=aJOTlE1K90k",
  "https://www.youtube.com/watch?v=kffacxfA7G4",
  "https://www.youtube.com/watch?v=hT_nvWreIhg",
  "https://www.youtube.com/watch?v=CevxZvSJLk8",
  "https://www.youtube.com/watch?v=KQ6zr6kCPj8",
  "https://www.youtube.com/watch?v=lWA2pjMjpBs",
  "https://www.youtube.com/watch?v=qpgTC9MDx1o",
  "https://www.youtube.com/watch?v=3tmd-ClpJxA",
  "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
  "https://www.youtube.com/watch?v=nfWlot6h_JM",
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const recommendedVideos = await getRecommendedVideos(VIDEO_IDS);
        const fetchedShows = recommendedVideos.map((video, index) => {
          const day = DAYS[index % 7];
          const hour = 8 + Math.floor(index / 7) * 2;
          const time = `${hour.toString().padStart(2, "0")}:00`;
          const status =
            index % 3 === 0
              ? "live"
              : index % 3 === 1
              ? "upcoming"
              : "completed";
          return { ...video, day, time, status } as Show;
        });
        setShows(fetchedShows);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const dailyShows = DAYS.reduce((acc, day) => {
    acc[day] = shows.filter((show) => show.day === day);
    return acc;
  }, {} as Record<string, Show[]>);

  const upcomingShows = shows
    .filter((show) => show.status === "upcoming")
    .slice(0, 12);
  const completedShows = shows
    .filter((show) => show.status === "completed")
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Calendar className="w-8 h-8" />
          <h1 className="text-3xl font-bold">TV Schedule</h1>
        </div>

        <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="grid grid-cols-7 mb-8">
            {DAYS.map((day) => (
              <TabsTrigger key={day} value={day} className="text-center">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="grid gap-6">
                {loading ? (
                  <p>Loading shows...</p>
                ) : (
                  dailyShows[day]?.map((show) => (
                    <Card key={show.id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex items-start gap-4 md:w-1/3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <span className="text-lg font-semibold">
                              {show.time}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {show.title}
                            </h3>
                            <Badge variant="secondary" className="mt-1">
                              {SHOW_TYPES.REALITY}
                            </Badge>
                          </div>
                        </div>

                        <div className="md:w-1/3">
                          <p className="text-muted-foreground line-clamp-2">
                            {show.channel.name}
                          </p>
                          <p className="text-sm mt-2">Views: {show.views}</p>
                        </div>

                        <div className="md:w-1/3 flex justify-end items-center">
                          {show.status === "live" && (
                            <Button className="gap-2">
                              <PlayCircle className="w-5 h-5" />
                              Watch Now
                            </Button>
                          )}
                          {show.status === "upcoming" && (
                            <Button variant="outline" className="gap-2">
                              <AlertCircle className="w-5 h-5" />
                              Set Reminder
                            </Button>
                          )}
                          {show.status === "completed" && (
                            <Button variant="secondary" className="gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Watch Recording
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Upcoming Shows */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingShows.map((show) => (
              <Card key={show.id} className="p-4">
                <div className="aspect-video mb-4">
                  <img
                    src={show.channel.avatar || "/placeholder.svg"}
                    alt={show.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="font-semibold mb-2">{show.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {show.day} at {show.time}
                </p>
                <Button variant="outline" className="w-full">
                  Set Reminder
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Recently Completed */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recently Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedShows.map((show) => (
              <Card key={show.id} className="p-4">
                <div className="aspect-video mb-4">
                  <img
                    src={show.channel.avatar || "/placeholder.svg"}
                    alt={show.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="font-semibold mb-2">{show.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Aired on {show.day} at {show.time}
                </p>
                <Button variant="secondary" className="w-full">
                  Watch Recording
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

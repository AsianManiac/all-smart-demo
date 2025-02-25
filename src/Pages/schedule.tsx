import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Link, useNavigate } from "react-router-dom";

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
  "https://www.youtube.com/watch?v=fum_mMfKftg",
  "https://www.youtube.com/watch?v=4DvgJOL_E3I",
  "https://www.youtube.com/watch?v=J5ROH_QTDO4",
  "https://www.youtube.com/watch?v=A1aNjrDoHoo",
  "https://www.youtube.com/watch?v=fmIS-xvdPcI",
  "https://www.youtube.com/watch?v=gYMPe68a1lE",
  "https://www.youtube.com/watch?v=aNWbJ99I7es",
  "https://www.youtube.com/watch?v=AdUcYgiAKQU",
  "https://www.youtube.com/watch?v=W5-Td8UcWBw",
  "https://www.youtube.com/watch?v=aYBj6VwY9og",
  "https://www.youtube.com/watch?v=Uzats0OZx8I",
  "https://www.youtube.com/watch?v=1758rwDNl78",
  "https://www.youtube.com/watch?v=7-c5oZ3oaRc",
  "https://www.youtube.com/watch?v=6IwNP1fPZFA",
  "https://www.youtube.com/watch?v=Kjx991G_xgA",
  "https://www.youtube.com/watch?v=0cg2mLz_Re4",
  "https://www.youtube.com/watch?v=bPjoHiFJCak",
  "https://www.youtube.com/watch?v=pUKiCo0iD9I",
  "https://www.youtube.com/watch?v=y2ot4-n6HVs",
  "https://www.youtube.com/watch?v=pFFhkTyh52g",
  "https://www.youtube.com/watch?v=c17Sm-ISeAw",
  "https://www.youtube.com/watch?v=pAh3dfFUhJg",
  "https://www.youtube.com/watch?v=Mhbx-0dAKiQ",
  "https://www.youtube.com/watch?v=b9HQMSjhbf0",
  "https://www.youtube.com/watch?v=thaRvv1i3XI",
  "https://www.youtube.com/watch?v=SoRQPAK2jGE",
  "https://www.youtube.com/watch?v=cll6wgAyIBs",
  "https://www.youtube.com/watch?v=v97e96hON1k",
  "https://www.youtube.com/watch?v=l-7TnYigx-c",
  "https://www.youtube.com/watch?v=gXDBH7Pll-c",
  "https://www.youtube.com/watch?v=Iw2QbvpqC1s",
  "https://www.youtube.com/watch?v=tkYUupgE1YY",
  "https://www.youtube.com/watch?v=NCsqpJLECa4",
  "https://www.youtube.com/watch?v=pNvfLNztmAo",
  "https://www.youtube.com/watch?v=uU4lsTdZgyk",
  "https://www.youtube.com/watch?v=Bga83IxOGds",
  "https://www.youtube.com/watch?v=koX-MPWV1Gg",
  "https://www.youtube.com/watch?v=jopyPP6bnNQ",
  "https://www.youtube.com/watch?v=NWJTxbOUDDY",
  "https://www.youtube.com/watch?v=ojW-n3hGJM4",
  "https://www.youtube.com/watch?v=gFEpMBctHkY",
  "https://www.youtube.com/watch?v=4fscupufUrg",
  "https://www.youtube.com/watch?v=ejm1aRCmmos",
  "https://www.youtube.com/watch?v=dK7HvAF_WIY",
  "https://www.youtube.com/watch?v=6xOwVC98Cjc",
];

export default function SchedulePage() {
  const navigate = useNavigate();
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
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-muted-foreground" />
                              <span className="text-lg font-semibold">
                                {show.time}
                              </span>
                            </div>
                            <img
                              src={show.allThumbnails.default.url}
                              alt={show.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <Popover>
                              <PopoverTrigger>
                                <h3 className="font-semibold text-lg line-clamp-4 text-left">
                                  {show.title}
                                </h3>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p className="    ">{show.title}</p>
                              </PopoverContent>
                            </Popover>
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
                            <Button
                              className="gap-2"
                              onClick={() => navigate(`/shows/${show.id}`)}
                            >
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
                            <Button
                              variant="secondary"
                              className="gap-2"
                              onClick={() => navigate(`/shows/${show.id}`)}
                            >
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
                <div
                  onClick={() => navigate(`/shows/${show.id}`)}
                  className="aspect-video mb-4 cursor-pointer"
                >
                  <img
                    src={show.allThumbnails.medium.url}
                    alt={show.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <Link to={`/shows/${show.id}`} className="font-semibold mb-2">
                  {show.title}
                </Link>
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
                <div
                  onClick={() => navigate(`/shows/${show.id}`)}
                  className="aspect-video mb-4 cursor-pointer"
                >
                  <img
                    src={show.allThumbnails.medium.url}
                    alt={show.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <Link to={`/shows/${show.id}`} className="font-semibold mb-2">
                  {show.title}
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  Aired on {show.day} at {show.time}
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate(`/shows/${show.id}`)}
                >
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

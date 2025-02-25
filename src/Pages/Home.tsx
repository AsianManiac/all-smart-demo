import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getRecommendedVideos } from "@/lib/video";
import { RecommendedVideo } from "@/types";
import { Calendar, Clock, Play, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURED_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=NqzdVN2tyvQ",
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
];
export default function Home() {
  const navigate = useNavigate();
  const [featuredShows, setFeaturedShows] = useState<RecommendedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await getRecommendedVideos(FEATURED_VIDEO_IDS);
        setFeaturedShows(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const scheduleHighlights = [
    { time: "20:00", show: "Big Brother Africa", type: "Reality" },
    { time: "21:30", show: "African Idol", type: "Competition" },
    { time: "22:45", show: "Love & Hip Hop Africa", type: "Reality" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {featuredShows.slice(0, 5).map((slide, index) => (
            <CarouselItem
              key={`${slide.id}-${index}`}
              className="relative min-w-0"
            >
              <div className="relative aspect-[16/9]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                <img
                  src={slide.allThumbnails?.standard?.url}
                  alt={slide.title}
                  className="w-full h-full object-center"
                />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 max-w-2xl">
                    Experience the drama and excitement of our top-rated reality
                    shows.
                  </p>
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => navigate(`/shows/${slide.id}`)}
                  >
                    <Play className="w-5 h-5" /> Watch Now
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Live Now Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Live Now</h2>
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="aspect-video">
                <img
                  src="/live-show.jpg"
                  alt="Live Show"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-2">African Masterchef</h3>
                  <p className="text-sm opacity-90">Season 5 Episode 12</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Today's Schedule */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Today's Schedule</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduleHighlights.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg font-semibold">{item.time}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.show}</h3>
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">View Full Schedule</Button>
          </div>
        </div>
      </section>

      {/* Popular Shows */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Popular Shows</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!loading &&
              featuredShows.slice(0, 5).map((show) => (
                <Card key={show.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={show.channel.avatar || "/placeholder.svg"}
                      alt={show.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => navigate(`/shows/${show.id}`)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">{show.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {show.views} views
                    </p>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Show</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and stay updated with the latest shows,
            episodes, and behind-the-scenes content.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-primary-foreground text-primary"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

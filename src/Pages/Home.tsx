import MaxWidthWrapper from "@/components/MaxWidthWrapper";
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
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

const FEATURED_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=S2HnHrceP1Y",
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
  "https://www.youtube.com/watch?v=pFFhkTyh52g",
  "https://www.youtube.com/watch?v=c17Sm-ISeAw",
  "https://www.youtube.com/watch?v=pAh3dfFUhJg",
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
    <MaxWidthWrapper className="">
      {/* Hero Carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-9">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredShows.slice(0, 3).map((slide, index) => (
                <CarouselItem key={`${slide.id}-${index}`} className="min-w-0">
                  <div className="h-full aspect-video object-cover brightness-[80%]">
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${slide.id}`}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="lg:col-span-3">
          {/* Today's Schedule */}
          <section className="bg-muted/30">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Today's Schedule</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
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
          </section>
        </div>
      </div>

      {/* Live Now Section */}
      <section className="py-8">
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
      </section>

      {/* Popular Shows */}
      <section className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Popular Shows</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!loading &&
            featuredShows.slice(0, 5).map((show, index) => (
              <Card key={`${show.id}_${index}`} className="overflow-hidden">
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
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gray-900 text-primary-foreground">
        <div className="text-center">
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
    </MaxWidthWrapper>
  );
}

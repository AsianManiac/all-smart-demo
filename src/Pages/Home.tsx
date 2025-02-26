import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  ConnectionStatus,
  ErrorState,
} from "@/components/navigation/api-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { CustomError, formatNumber, useRecommendedVideos } from "@/lib/video";
import { RecommendedVideo } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Flame,
  Heart,
  Play,
  Search,
  Star,
  TrendingUp,
  Trophy,
  Tv,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";

// Featured videos for the hero carousel
const FEATURED_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=S2HnHrceP1Y",
  "https://www.youtube.com/watch?v=Uzats0OZx8I",
  "https://www.youtube.com/watch?v=1758rwDNl78",
  "https://www.youtube.com/watch?v=7-c5oZ3oaRc",
  "https://www.youtube.com/watch?v=6IwNP1fPZFA",
];

// Trending videos
const TRENDING_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=Kjx991G_xgA",
  "https://www.youtube.com/watch?v=0cg2mLz_Re4",
  "https://www.youtube.com/watch?v=bPjoHiFJCak",
  "https://www.youtube.com/watch?v=pUKiCo0iD9I",
  "https://www.youtube.com/watch?v=y2ot4-n6HVs",
  "https://www.youtube.com/watch?v=pFFhkTyh52g",
];

// Popular competition shows
const COMPETITION_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=c17Sm-ISeAw",
  "https://www.youtube.com/watch?v=pAh3dfFUhJg",
  "https://www.youtube.com/watch?v=Iw2QbvpqC1s",
  "https://www.youtube.com/watch?v=tkYUupgE1YY",
];

// Reality shows
const REALITY_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=NCsqpJLECa4",
  "https://www.youtube.com/watch?v=pNvfLNztmAo",
  "https://www.youtube.com/watch?v=uU4lsTdZgyk",
  "https://www.youtube.com/watch?v=Bga83IxOGds",
];

// Lifestyle shows
const LIFESTYLE_VIDEO_IDS = [
  "https://www.youtube.com/watch?v=koX-MPWV1Gg",
  "https://www.youtube.com/watch?v=jopyPP6bnNQ",
  "https://www.youtube.com/watch?v=NWJTxbOUDDY",
  "https://www.youtube.com/watch?v=ojW-n3hGJM4",
];

interface VideoDataState {
  data: RecommendedVideo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: CustomError | null;
  isEmpty?: boolean;
}
// Initial state for video data
const initialVideoState: VideoDataState = {
  isLoading: true,
  isError: false,
  error: null,
  data: [],
  isEmpty: false,
};

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // State for different video sections
  const [featuredState, setFeaturedState] =
    useState<VideoDataState>(initialVideoState);
  const [trendingState, setTrendingState] =
    useState<VideoDataState>(initialVideoState);
  const [competitionState, setCompetitionState] =
    useState<VideoDataState>(initialVideoState);
  const [realityState, setRealityState] =
    useState<VideoDataState>(initialVideoState);
  const [lifestyleState, setLifestyleState] =
    useState<VideoDataState>(initialVideoState);

  const fetchFeaturedVideos = useCallback(async () => {
    try {
      setFeaturedState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(FEATURED_VIDEO_IDS);

      setFeaturedState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setFeaturedState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch featured videos"),
        data: [],
        isEmpty: false,
      });
    }
  }, []);

  // Fetch trending videos
  const fetchTrendingVideos = useCallback(async () => {
    try {
      setTrendingState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(TRENDING_VIDEO_IDS);

      setTrendingState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setTrendingState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch trending videos"),
        data: [],
        isEmpty: false,
      });
    }
  }, []);

  // Fetch competition videos
  const fetchCompetitionVideos = useCallback(async () => {
    try {
      setCompetitionState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(COMPETITION_VIDEO_IDS);

      setCompetitionState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setCompetitionState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch competition videos"),
        data: [],
        isEmpty: false,
      });
    }
  }, []);

  // Fetch reality videos
  const fetchRealityVideos = useCallback(async () => {
    try {
      setRealityState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(REALITY_VIDEO_IDS);

      setRealityState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setRealityState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch reality videos"),
        data: [],
        isEmpty: false,
      });
    }
  }, []);

  // Fetch lifestyle videos
  const fetchLifestyleVideos = useCallback(async () => {
    try {
      setLifestyleState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(LIFESTYLE_VIDEO_IDS);

      setLifestyleState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setLifestyleState({
        isLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch lifestyle videos"),
        data: [],
        isEmpty: false,
      });
    }
  }, []);

  // Initialize data fetching on component mount
  useEffect(() => {
    fetchFeaturedVideos();
    fetchTrendingVideos();
    fetchCompetitionVideos();
    fetchRealityVideos();
    fetchLifestyleVideos();
  }, [
    fetchFeaturedVideos,
    fetchTrendingVideos,
    fetchCompetitionVideos,
    fetchRealityVideos,
    fetchLifestyleVideos,
  ]);

  const scheduleHighlights = [
    {
      time: "20:00",
      show: "Big Brother Africa",
      type: "Reality",
      channel: "Africa Magic",
    },
    {
      time: "21:30",
      show: "African Idol",
      type: "Competition",
      channel: "MNet",
    },
    {
      time: "22:45",
      show: "Love & Hip Hop Africa",
      type: "Reality",
      channel: "BET Africa",
    },
  ];

  const categories = [
    { id: "all", name: "All Shows", icon: <Tv className="w-4 h-4" /> },
    { id: "trending", name: "Trending", icon: <Flame className="w-4 h-4" /> },
    {
      id: "competition",
      name: "Competition",
      icon: <Trophy className="w-4 h-4" />,
    },
    { id: "reality", name: "Reality", icon: <Users className="w-4 h-4" /> },
    { id: "lifestyle", name: "Lifestyle", icon: <Heart className="w-4 h-4" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (featuredState.isLoading) {
    return <HomePageSkeleton />;
  }

  if (featuredState.isError) {
    return (
      <MaxWidthWrapper className="py-10">
        <div className="flex justify-end mb-4">
          <ConnectionStatus />
        </div>
        <ErrorState
          error={featuredState.error || new Error("Failed to load content")}
          onRetry={fetchFeaturedVideos}
          className="min-h-[60vh] flex items-center justify-center"
        />
      </MaxWidthWrapper>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2 sr-only">
            <Tv className="w-6 h-6 text-primary" />
          </div>
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search shows, episodes, or channels..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <ConnectionStatus />
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <TabsList className="grid grid-cols-5 w-full">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  <span className="hidden md:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Featured Carousel */}
            <div className="lg:col-span-9">
              <Carousel
                className="w-full"
                plugins={[
                  Autoplay({
                    delay: 4000,
                  }),
                ]}
              >
                <CarouselContent>
                  {featuredState.data?.map((slide, index) => (
                    <CarouselItem
                      key={`${slide.id}-${index}`}
                      className="min-w-0"
                    >
                      <motion.div
                        variants={fadeIn("up", "spring", index * 0.3, 0.8)}
                        className="relative aspect-video rounded-xl overflow-hidden"
                      >
                        <ReactPlayer
                          url={`https://www.youtube.com/watch?v=${slide.id}`}
                          width="100%"
                          height="100%"
                          light={slide.allThumbnails.high.url}
                          playing={false}
                          controls
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h2 className="text-white text-xl font-bold line-clamp-1">
                            {slide.title}
                          </h2>
                          <p className="text-white/80 text-sm">
                            {slide.channel.name} • {formatNumber(slide.views)}{" "}
                            views
                          </p>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="absolute left-4 top-1/2" />
                  <CarouselNext className="absolute right-4 top-1/2" />
                </div>
              </Carousel>
            </div>

            {/* Today's Schedule */}
            <motion.div
              variants={fadeIn("left", "spring", 0.5, 1)}
              className="lg:col-span-3"
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Today's Schedule</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {scheduleHighlights.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeIn("up", "spring", index * 0.3, 0.8)}
                      >
                        <Card
                          key={index}
                          className="p-3 bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{item.time}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold line-clamp-1">
                                {item.show}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {item.channel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Trending Now Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {trendingState.isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div className="p-1">
                        <Skeleton className="w-full aspect-video rounded-lg" />
                        <Skeleton className="h-5 w-full mt-2" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                      </div>
                    </CarouselItem>
                  ))
              ) : trendingState.isError ? (
                <CarouselItem className="basis-full">
                  <ErrorState
                    error={
                      trendingState.error || new Error("Failed to load content")
                    }
                    onRetry={fetchTrendingVideos}
                    className="h-[200px]"
                  />
                </CarouselItem>
              ) : (
                trendingState.data?.map((show, index) => (
                  <CarouselItem
                    key={show.id}
                    className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <motion.div
                      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                      className="p-1"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden group">
                        <img
                          src={
                            show.allThumbnails.medium.url || "/placeholder.svg"
                          }
                          alt={show.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full"
                            onClick={() => navigate(`/shows/${show.id}`)}
                          >
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                          {show.duration}
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Flame className="w-3 h-3 text-red-500" />
                            Trending
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold mt-2 line-clamp-1 group-hover:text-primary transition-colors">
                        <Link to={`/shows/${show.id}`}>{show.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(show.views)} views
                      </p>
                    </motion.div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </motion.section>

        {/* Categories Tabs */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Popular Categories</h2>
          </div>
          <Tabs defaultValue="competition">
            <TabsList className="mb-6">
              <TabsTrigger
                value="competition"
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Competition
              </TabsTrigger>
              <TabsTrigger value="reality" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Reality
              </TabsTrigger>
              <TabsTrigger
                value="lifestyle"
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Lifestyle
              </TabsTrigger>
            </TabsList>

            <TabsContent value="competition" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {competitionState.isLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="w-full aspect-video" />
                        <div className="p-4">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                      </Card>
                    ))
                ) : competitionState.isError ? (
                  <div className="col-span-full">
                    <ErrorState
                      error={
                        competitionState.error ||
                        new Error("Failed to load content")
                      }
                      onRetry={fetchCompetitionVideos}
                    />
                  </div>
                ) : (
                  competitionState.data?.map((show, index) => (
                    <motion.div
                      key={show.id}
                      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                    >
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-video">
                          <img
                            src={
                              show.allThumbnails?.medium?.url ||
                              "/placeholder.svg"
                            }
                            alt={show.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                            {show.duration}
                          </div>
                          <Link
                            to={`/shows/${show.id}`}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Trophy className="w-12 h-12 text-yellow-500" />
                          </Link>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <Link to={`/shows/${show.id}`} className="mb-2">
                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                              {show.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-auto">
                            <Badge variant="outline">Competition</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatNumber(show.views)} views
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="reality" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {realityState.isLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="w-full aspect-video" />
                        <div className="p-4">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                      </Card>
                    ))
                ) : realityState.isError ? (
                  <div className="col-span-full">
                    <ErrorState
                      error={
                        realityState.error ||
                        new Error("Failed to load content")
                      }
                      onRetry={fetchRealityVideos}
                    />
                  </div>
                ) : (
                  realityState.data?.map((show, index) => (
                    <motion.div
                      key={show.id}
                      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                    >
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-video">
                          <img
                            src={
                              show.allThumbnails?.medium?.url ||
                              "/placeholder.svg"
                            }
                            alt={show.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                            {show.duration}
                          </div>
                          <Link
                            to={`/shows/${show.id}`}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Users className="w-12 h-12 text-blue-500" />
                          </Link>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <Link to={`/shows/${show.id}`} className="mb-2">
                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                              {show.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-auto">
                            <Badge variant="outline">Reality</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatNumber(show.views)} views
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {lifestyleState.isLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="w-full aspect-video" />
                        <div className="p-4">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                      </Card>
                    ))
                ) : lifestyleState.isError ? (
                  <div className="col-span-full">
                    <ErrorState
                      error={
                        lifestyleState.error ||
                        new Error("Failed to load content")
                      }
                      onRetry={fetchLifestyleVideos}
                    />
                  </div>
                ) : (
                  lifestyleState.data?.map((show, index) => (
                    <motion.div
                      key={show.id}
                      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                    >
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-video">
                          <img
                            src={
                              show.allThumbnails?.medium?.url ||
                              "/placeholder.svg"
                            }
                            alt={show.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                            {show.duration}
                          </div>
                          <Link
                            to={`/shows/${show.id}`}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Heart className="w-12 h-12 text-pink-500" />
                          </Link>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <Link to={`/shows/${show.id}`} className="mb-2">
                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                              {show.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-auto">
                            <Badge variant="outline">Lifestyle</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatNumber(show.views)} views
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Newsletter Subscription */}
        <motion.section
          variants={fadeIn("up", "spring", 0.5, 1)}
          className="py-12 px-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl mb-12"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Never Miss a Show</h2>
            <p className="text-lg mb-8">
              Subscribe to our newsletter and stay updated with the latest
              shows, episodes, and behind-the-scenes content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </motion.section>

        {/* Featured Channels */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Featured Channels</h2>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn("up", "spring", i * 0.1, 0.75)}
                >
                  <Card className="overflow-hidden text-center hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-muted">
                        <img
                          src={`/placeholder.svg?height=64&width=64&text=Channel ${
                            i + 1
                          }`}
                          alt={`Channel ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold">Channel {i + 1}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        1.2M subscribers
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </motion.section>

        {/* Coming Soon */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Coming Soon</h2>
          </div>
          <Card className="overflow-hidden">
            <div className="relative aspect-[21/9]">
              <img
                src="/placeholder.svg?height=400&width=1200&text=Season+Premiere"
                alt="Season Premiere"
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Badge variant="secondary" className="mb-4">
                  SEASON PREMIERE
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-2">
                  Big Brother Africa
                </h2>
                <p className="text-xl md:text-2xl mb-6">
                  Season 10 • Starting June 15
                </p>
                <Button size="lg" className="gap-2">
                  <Calendar className="w-5 h-5" />
                  Set Reminder
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* App Download */}
        <motion.section
          variants={fadeIn("up", "spring", 0.5, 1)}
          className="mb-12 bg-muted rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Watch Anywhere</h2>
              <p className="text-lg mb-6">
                Download our mobile app to watch your favorite shows on the go.
                Available for iOS and Android devices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" className="gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path>
                    <path d="M16 3v4"></path>
                    <path d="M8 3v4"></path>
                    <path d="M3 11h18"></path>
                    <path d="M19 16v6"></path>
                    <path d="M22 19l-3-3-3 3"></path>
                  </svg>
                  App Store
                </Button>
                <Button variant="outline" className="gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"></path>
                    <path d="M4 15h12"></path>
                    <path d="M7 19h5"></path>
                    <path d="M13 5v14"></path>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img
                src="/placeholder.svg?height=400&width=400&text=App+Screenshot"
                alt="Mobile App"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.section>
      </MaxWidthWrapper>
    </div>
  );
}

const HomePageSkeleton = () => (
  <MaxWidthWrapper className="py-8">
    <div className="flex justify-between items-center mb-8">
      <Skeleton className="h-8 w-32" />
      <div className="flex-1 max-w-md mx-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>

    <Skeleton className="h-10 w-full mb-8" />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
      <div className="lg:col-span-9">
        <Skeleton className="w-full aspect-video rounded-xl" />
      </div>
      <div className="lg:col-span-3">
        <Skeleton className="w-full h-full min-h-[200px] rounded-xl" />
      </div>
    </div>

    <div className="mb-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
      </div>
    </div>

    <div className="mb-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="w-full h-[300px] rounded-xl" />
    </div>
  </MaxWidthWrapper>
);

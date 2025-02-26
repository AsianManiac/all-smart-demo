import { FullPageLoader } from "@/components/full-page-loader";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ErrorState } from "@/components/navigation/api-state";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { ShowCard, ShowStatus } from "@/components/show-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { useRecommendedVideos } from "@/lib/video";
import { RecommendedVideo } from "@/types";
import { motion } from "framer-motion";
import { Filter, Grid3X3, List, Search, Tag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  {
    id: "reality",
    name: "Reality",
    videoIds: [
      "https://www.youtube.com/watch?v=NCsqpJLECa4",
      "https://www.youtube.com/watch?v=jopyPP6bnNQ",
      "https://www.youtube.com/watch?v=NWJTxbOUDDY",
      "https://www.youtube.com/watch?v=ojW-n3hGJM4",
    ],
  },
  {
    id: "competition",
    name: "Competition",
    videoIds: [
      "https://www.youtube.com/watch?v=c17Sm-ISeAw",
      "https://www.youtube.com/watch?v=c17Sm-ISeAw",
      "https://www.youtube.com/watch?v=pAh3dfFUhJg",
      "https://www.youtube.com/watch?v=Iw2QbvpqC1s",
      "https://www.youtube.com/watch?v=tkYUupgE1YY",
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    videoIds: [
      "https://www.youtube.com/watch?v=koX-MPWV1Gg",
      "https://www.youtube.com/watch?v=uU4lsTdZgyk",
      "https://www.youtube.com/watch?v=Bga83IxOGds",
      "https://www.youtube.com/watch?v=pNvfLNztmAo",
      "https://www.youtube.com/watch?v=uU4lsTdZgyk",
      "https://www.youtube.com/watch?v=Bga83IxOGds",
    ],
  },
  {
    id: "drama",
    name: "Drama",
    videoIds: [
      "https://www.youtube.com/watch?v=gFEpMBctHkY",
      "https://www.youtube.com/watch?v=bPjoHiFJCak",
      "https://www.youtube.com/watch?v=pUKiCo0iD9I",
      "https://www.youtube.com/watch?v=y2ot4-n6HVs",
      "https://www.youtube.com/watch?v=pFFhkTyh52g",
    ],
  },
  {
    id: "documentary",
    name: "Documentary",
    videoIds: [
      "https://www.youtube.com/watch?v=6xOwVC98Cjc",
      "https://www.youtube.com/watch?v=Uzats0OZx8I",
      "https://www.youtube.com/watch?v=1758rwDNl78",
      "https://www.youtube.com/watch?v=7-c5oZ3oaRc",
    ],
  },
];

interface VideoDataState {
  data: RecommendedVideo[];
  isLoading?: boolean;
  isError?: boolean;
  error?: CustomError | null;
  isEmpty?: boolean;
}

const initialVideoState: VideoDataState = {
  isLoading: true,
  isError: false,
  error: null,
  data: [],
  isEmpty: false,
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("reality");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [realityVideos, setRealityVideos] =
    useState<VideoDataState>(initialVideoState);
  const [competitionVideos, setCompetitionVideos] =
    useState<VideoDataState>(initialVideoState);
  const [lifestyleVideos, setLifestyleVideos] =
    useState<VideoDataState>(initialVideoState);
  const [dramaVideos, setDramaVideos] =
    useState<VideoDataState>(initialVideoState);
  const [documentaryVideos, setDocumentaryVideos] =
    useState<VideoDataState>(initialVideoState);

  const fetchFeaturedVideos = useCallback(async () => {
    try {
      setRealityVideos((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(CATEGORIES[0].videoIds);

      setRealityVideos({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setRealityVideos({
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

  const fetchCompetitionVideos = useCallback(async () => {
    try {
      setCompetitionVideos((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(CATEGORIES[1].videoIds);

      setCompetitionVideos({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setCompetitionVideos({
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

  const fetchLifestyleVideos = useCallback(async () => {
    try {
      setLifestyleVideos((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(CATEGORIES[2].videoIds);

      setLifestyleVideos({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setLifestyleVideos({
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

  const fetchDramaVideos = useCallback(async () => {
    try {
      setDramaVideos((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(CATEGORIES[3].videoIds);

      setDramaVideos({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setDramaVideos({
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

  const fetchDocumentaryVideos = useCallback(async () => {
    try {
      setDocumentaryVideos((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(CATEGORIES[4].videoIds);

      setDocumentaryVideos({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setDocumentaryVideos({
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

  useEffect(() => {
    fetchFeaturedVideos();
    fetchCompetitionVideos();
    fetchLifestyleVideos();
    fetchDramaVideos();
    fetchDocumentaryVideos();
  }, [
    realityVideos,
    competitionVideos,
    lifestyleVideos,
    dramaVideos,
    documentaryVideos,
  ]);

  const isLoading =
    realityVideos.isLoading ||
    competitionVideos.isLoading ||
    lifestyleVideos.isLoading ||
    dramaVideos.isLoading ||
    documentaryVideos.isLoading;

  const isError =
    realityVideos.error ||
    competitionVideos.error ||
    lifestyleVideos.error ||
    dramaVideos.error ||
    documentaryVideos.error;

  const error =
    realityVideos ||
    competitionVideos ||
    lifestyleVideos ||
    dramaVideos ||
    documentaryVideos;

  const getFilteredShows = (categoryId: string) => {
    const shows = {
      reality: realityVideos.data || [],
      competition: competitionVideos.data || [],
      lifestyle: lifestyleVideos.data || [],
      drama: dramaVideos.data || [],
      documentary: documentaryVideos.data || [],
    }[categoryId];

    // @ts-ignore
    return shows.filter((show) => {
      const matchesSearch =
        searchQuery === "" ||
        show.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) => {
          if (filter === "new" && show.views < "100000") return true;
          if (filter === "popular" && Number.parseInt(show.views) > 500000)
            return true;
          if (filter === "short" && show.duration.split(":")[0] === "0")
            return true;
          if (
            filter === "long" &&
            Number.parseInt(show.duration.split(":")[0]) >= 20
          )
            return true;
          return false;
        });

      return matchesSearch && matchesFilters;
    });
  };

  if (isLoading) return <FullPageLoader message="Loading Categories..." />;
  if (isError)
    return (
      <ErrorState
        error={error.error || new Error("Error failure failed.")}
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <MaxWidthWrapper className="py-8">
      <PageHeader
        icon={Tag}
        title="Show Categories"
        description="Browse shows by category"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search in this category..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Show Filters</h4>
                    <div className="grid gap-2">
                      {[
                        { id: "new", label: "New Releases" },
                        { id: "popular", label: "Popular" },
                        { id: "short", label: "Short (<20 min)" },
                        { id: "long", label: "Long (>20 min)" },
                      ].map((filter) => (
                        <div
                          key={filter.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`filter-${filter.id}`}
                            checked={selectedFilters.includes(filter.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFilters((prev) => [
                                  ...prev,
                                  filter.id,
                                ]);
                              } else {
                                setSelectedFilters((prev) =>
                                  prev.filter((f) => f !== filter.id)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`filter-${filter.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {filter.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFilters([])}
                    >
                      Reset
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none rounded-l-md"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none rounded-r-md"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </PageHeader>

      <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-8">
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <SectionHeader
                title={`${category.name} Shows`}
                description={`Browse our collection of ${category.name.toLowerCase()} shows`}
              />

              {getFilteredShows(category.id).length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">No Shows Found</h3>
                  <p className="text-muted-foreground">
                    There are no {category.name.toLowerCase()} shows that match
                    your search or filters.
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {getFilteredShows(category.id).map(
                    (
                      show: RecommendedVideo & {
                        day?: string;
                        time?: string;
                        status?: ShowStatus;
                        type?: string;
                      },
                      index: number
                    ) => (
                      <motion.div
                        key={show.id}
                        variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                      >
                        <ShowCard
                          show={{
                            ...show,
                            type: category.name,
                            status:
                              index % 5 === 0
                                ? "live"
                                : index % 4 === 0
                                ? "upcoming"
                                : "completed",
                          }}
                          variant={
                            viewMode === "list" ? "horizontal" : "default"
                          }
                          onRemind={() => toast.info("Reminder Set")}
                          onFavorite={() => toast.success("Added to Favorites")}
                        />
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </MaxWidthWrapper>
  );
}

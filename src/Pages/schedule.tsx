import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  ConnectionStatus,
  ErrorState,
} from "@/components/navigation/api-state";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { ShowCard, ShowCardSkeleton, ShowStatus } from "@/components/show-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { CustomError, useRecommendedVideos } from "@/lib/video";
import type { RecommendedVideo } from "@/types";
import { motion } from "framer-motion";
import { CalendarIcon, Filter, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SHOW_TYPES = [
  "Reality",
  "Competition",
  "Drama",
  "Lifestyle",
  "Entertainment",
  "Documentary",
];

const TIME_SLOTS = [
  "Morning (6AM-12PM)",
  "Afternoon (12PM-5PM)",
  "Evening (5PM-8PM)",
  "Prime Time (8PM-11PM)",
  "Late Night (11PM-6AM)",
];

interface Show extends RecommendedVideo {
  day: string;
  time: string;
  status: ShowStatus;
  type: string;
}

// Initial state for video data
interface ScheduleDataState {
  isLoading: boolean;
  isPageLoading?: boolean;
  isError: boolean;
  error: CustomError | null;
  data: Show[];
  isEmpty: boolean;
}

const initialScheduleState: ScheduleDataState = {
  isLoading: true,
  isPageLoading: true,
  isError: false,
  error: null,
  data: [],
  isEmpty: false,
};

export default function SchedulePage() {
  const [scheduleState, setScheduleState] =
    useState<ScheduleDataState>(initialScheduleState);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay()]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch schedule data
  const fetchScheduleData = useCallback(async () => {
    try {
      setScheduleState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(VIDEO_IDS);

      if (response.isError) {
        throw response.error || new Error("Failed to fetch schedule data");
      }

      // Transform videos into show data with additional properties
      const shows =
        scheduleState.data?.map((video: Show, index: number) => {
          const day = DAYS[index % 7];
          const hour = 8 + Math.floor(index / 7) * 2;
          const minute = index % 2 === 0 ? "00" : "30";
          const time = `${hour.toString().padStart(2, "0")}:${minute}`;

          // Determine status based on current time
          const now = new Date();
          const today = DAYS[now.getDay()];
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();

          let status: ShowStatus;
          if (day === today) {
            if (
              hour < currentHour ||
              (hour === currentHour && Number.parseInt(minute) < currentMinute)
            ) {
              status = "completed";
            } else if (
              hour === currentHour &&
              Math.abs(Number.parseInt(minute) - currentMinute) < 30
            ) {
              status = "live";
            } else {
              status = "upcoming";
            }
          } else {
            status = "upcoming";
          }

          // Assign a show type
          const type = SHOW_TYPES[index % SHOW_TYPES.length];

          return { ...video, day, time, status, type } as Show;
        }) || [];

      // Simulate a delay for the page loader to be visible
      setTimeout(() => {
        setScheduleState({
          isLoading: false,
          isPageLoading: false,
          isError: false,
          error: null,
          data: shows,
          isEmpty: shows.length === 0,
        });
      }, 1000);
    } catch (error) {
      setScheduleState({
        isLoading: false,
        isPageLoading: false,
        isError: true,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to fetch scedule videos"),
        data: [],
        isEmpty: true,
      });
    }
  }, []);

  const fetchDataVideos = useCallback(async () => {
    try {
      setScheduleState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      const response = await useRecommendedVideos(VIDEO_IDS);

      setScheduleState({
        isLoading: false,
        isError: response.isError,
        error: response.error,
        // @ts-ignore
        data: response.data || [],
        isEmpty: response.isEmpty,
      });
    } catch (error) {
      setScheduleState({
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

  useEffect(() => {
    if (scheduleState.error) {
      setScheduleState((prev) => ({
        ...prev,
        isLoading: false,
        isPageLoading: false,
        isError: true,
        error: null,
        data: [],
        isEmpty: true,
      }));
    }
  }, [scheduleState.error, scheduleState.isError]);

  useEffect(() => {
    if (!scheduleState.isLoading && scheduleState.data) {
      fetchScheduleData();
    }
    fetchDataVideos();
  }, [scheduleState.isLoading, scheduleState.data, fetchScheduleData]);

  // Filter shows based on search query, selected types, and time slots
  const filteredShows = scheduleState.data.filter((show) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.channel.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by show type
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(show.type);

    // Filter by time slot
    const matchesTimeSlot =
      selectedTimeSlots.length === 0 ||
      selectedTimeSlots.some((slot) => {
        const hour = Number.parseInt(show.time.split(":")[0]);
        if (slot === "Morning (6AM-12PM)" && hour >= 6 && hour < 12)
          return true;
        if (slot === "Afternoon (12PM-5PM)" && hour >= 12 && hour < 17)
          return true;
        if (slot === "Evening (5PM-8PM)" && hour >= 17 && hour < 20)
          return true;
        if (slot === "Prime Time (8PM-11PM)" && hour >= 20 && hour < 23)
          return true;
        if (slot === "Late Night (11PM-6AM)" && (hour >= 23 || hour < 6))
          return true;
        return false;
      });

    return matchesSearch && matchesType && matchesTimeSlot;
  });

  // Group shows by day
  const dailyShows = DAYS.reduce((acc, day) => {
    acc[day] = filteredShows.filter((show) => show.day === day);
    return acc;
  }, {} as Record<string, Show[]>);

  // Get upcoming and completed shows
  const upcomingShows = filteredShows
    .filter((show) => show.status === "upcoming")
    .slice(0, 6);

  const completedShows = filteredShows
    .filter((show) => show.status === "completed")
    .slice(0, 6);

  const liveShows = filteredShows.filter((show) => show.status === "live");

  const handleRemind = () => {
    toast.info("Reminder Set", {
      description: "We'll notify you when this show is about to start.",
    });
  };

  const handleFavorite = () => {
    toast.success("Added to Favorites", {
      description: "This show has been added to your favorites.",
    });
  };

  // If page is loading, show full page loader
  // if (scheduleState.isPageLoading) {
  //   return <FullPageLoader message="Loading TV Schedule..." />;
  // }

  // If there's an error, show error state
  if (scheduleState.isError) {
    return (
      <MaxWidthWrapper className="py-10">
        <div className="flex justify-end mb-4">
          <ConnectionStatus />
        </div>
        <ErrorState
          error={scheduleState.error || new Error("Failed to load content")}
          onRetry={fetchScheduleData}
          className="min-h-[60vh] flex items-center justify-center"
        />
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="py-8">
      <PageHeader
        icon={CalendarIcon}
        title="TV Schedule"
        description="Find out what's on and when"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search shows or channels..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Show Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SHOW_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes((prev) => [...prev, type]);
                            } else {
                              setSelectedTypes((prev) =>
                                prev.filter((t) => t !== type)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Time of Day</h4>
                  <div className="grid gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot} className="flex items-center space-x-2">
                        <Checkbox
                          id={`time-${slot}`}
                          checked={selectedTimeSlots.includes(slot)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimeSlots((prev) => [...prev, slot]);
                            } else {
                              setSelectedTimeSlots((prev) =>
                                prev.filter((s) => s !== slot)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`time-${slot}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {slot}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedTimeSlots([]);
                    }}
                  >
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </PageHeader>

      {/* Live Now Section */}
      {liveShows.length > 0 && (
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mb-8"
        >
          <SectionHeader
            title="Live Now"
            description="Watch these shows streaming live"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveShows.map((show, index) => (
              <motion.div
                key={show.id}
                variants={fadeIn("up", "spring", index * 0.1, 0.75)}
              >
                <ShowCard
                  show={show}
                  variant="featured"
                  onFavorite={handleFavorite}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Daily Schedule Tabs */}
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
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="space-y-6"
            >
              {!scheduleState.isLoading ? (
                // Show skeletons while loading
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <ShowCardSkeleton key={i} variant="horizontal" />
                  ))
              ) : dailyShows[day]?.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">
                    No Shows Scheduled
                  </h3>
                  <p className="text-muted-foreground">
                    There are no shows scheduled for {day} that match your
                    filters.
                  </p>
                </div>
              ) : (
                // Sort shows by time and render them
                dailyShows[day]
                  ?.sort((a, b) => a.time.localeCompare(b.time))
                  .map((show, index) => (
                    <motion.div
                      key={show.id}
                      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                    >
                      <ShowCard
                        show={show}
                        variant="horizontal"
                        onRemind={handleRemind}
                        onFavorite={handleFavorite}
                      />
                    </motion.div>
                  ))
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Upcoming Shows */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-12"
      >
        <SectionHeader
          title="Upcoming Shows"
          description="Set reminders for these upcoming shows"
        >
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {SHOW_TYPES.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleState.isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <ShowCardSkeleton key={i} />)
          ) : upcomingShows.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Upcoming Shows</h3>
              <p className="text-muted-foreground">
                There are no upcoming shows that match your filters.
              </p>
            </div>
          ) : (
            upcomingShows.map((show, index) => (
              <motion.div
                key={show.id}
                variants={fadeIn("up", "spring", index * 0.1, 0.75)}
              >
                <ShowCard
                  show={show}
                  onRemind={handleRemind}
                  onFavorite={handleFavorite}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* Recently Completed */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mt-12 mb-12"
      >
        <SectionHeader
          title="Recently Completed"
          description="Catch up on shows you might have missed"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleState.isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <ShowCardSkeleton key={i} />)
          ) : completedShows.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Completed Shows</h3>
              <p className="text-muted-foreground">
                There are no recently completed shows that match your filters.
              </p>
            </div>
          ) : (
            completedShows.map((show, index) => (
              <motion.div
                key={show.id}
                variants={fadeIn("up", "spring", index * 0.1, 0.75)}
              >
                <ShowCard show={show} onFavorite={handleFavorite} />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>
    </MaxWidthWrapper>
  );
}

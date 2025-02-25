import RecommendedVideos from "@/components/recommended-videos";
import { getRecommendedVideos } from "@/lib/video";
import type { RecommendedVideo } from "@/types";
import { useEffect, useState } from "react";

export default function Shows() {
  const [recommendedVideos, setRecommendedVideos] = useState<
    RecommendedVideo[]
  >([]);

  const recommendedUrls = [
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

  useEffect(() => {
    const fetchData = async () => {
      const recommended = await getRecommendedVideos(recommendedUrls);
      setRecommendedVideos(recommended);
    };
    fetchData();
  }, []);

  if (!recommendedVideos) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto py-6 px-4">
        <RecommendedVideos videos={recommendedVideos} />
      </div>
    </div>
  );
}

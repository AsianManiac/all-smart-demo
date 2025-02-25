import RecommendedVideos from "@/components/recommended-videos";
import { getRecommendedVideos } from "@/lib/video";
import type { RecommendedVideo } from "@/types";
import { useEffect, useState } from "react";

export default function Shows() {
  const [recommendedVideos, setRecommendedVideos] = useState<
    RecommendedVideo[]
  >([]);

  const recommendedUrls = [
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

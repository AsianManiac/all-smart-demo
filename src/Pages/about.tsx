import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Award,
  Globe,
  Heart,
  Radio,
  Star,
  Trophy,
  Tv,
  Users,
} from "lucide-react";

export default function About() {
  return (
    <MaxWidthWrapper>
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <img
            src="/about-hero.jpg"
            alt="TV Station"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative container mx-auto h-full flex items-center px-4">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Africa's Premier Reality TV Network
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Bringing you the best in African entertainment since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We are dedicated to showcasing the rich diversity of African
              culture and talent through compelling reality TV programming that
              entertains, educates, and inspires audiences across the continent
              and beyond.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">10M+</p>
                <p className="text-sm text-muted-foreground">Daily Viewers</p>
              </Card>
              <Card className="p-4 text-center">
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">25+</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </Card>
              <Card className="p-4 text-center">
                <Radio className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">100+</p>
                <p className="text-sm text-muted-foreground">Shows Produced</p>
              </Card>
              <Card className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">50+</p>
                <p className="text-sm text-muted-foreground">Awards Won</p>
              </Card>
            </div>
          </div>
          <div className="relative">
            <img
              src="/mission-image.jpg"
              alt="Behind the scenes"
              className="rounded-lg shadow-xl"
            />
            <Badge
              className="absolute top-4 right-4 text-lg py-2 px-4"
              variant="secondary"
            >
              Est. 2010
            </Badge>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 bg-muted/30">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((member) => (
            <Card key={member} className="overflow-hidden">
              <div className="aspect-square">
                <img
                  src={`/team-${member}.jpg`}
                  alt={`Team Member ${member}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-muted-foreground">
                  Executive Producer
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Achievements Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Our Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6">
            <Award className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Best Reality TV Network
            </h3>
            <p className="text-muted-foreground">
              African Entertainment Awards 2023
            </p>
          </Card>
          <Card className="p-6">
            <Star className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Most Watched Network</h3>
            <p className="text-muted-foreground">
              Digital Broadcasting Awards 2023
            </p>
          </Card>
          <Card className="p-6">
            <Tv className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Innovation in Broadcasting
            </h3>
            <p className="text-muted-foreground">
              African Media Excellence 2023
            </p>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-900 text-primary-foreground">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p>We are passionate about African storytelling</p>
            </div>
            <div>
              <Star className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p>We strive for excellence in everything we do</p>
            </div>
            <div>
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p>We build and nurture our viewing community</p>
            </div>
            <div>
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Diversity</h3>
              <p>We celebrate Africa's rich cultural diversity</p>
            </div>
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}

import { Header } from "@/components/Header";
import { HeroCard } from "@/components/HeroCard";
import { TrainingFeed } from "@/components/TrainingFeed";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Safe area for mobile */}
      <div className="max-w-md mx-auto">
        <Header />
        <main className="pt-2">
          <HeroCard />
          <TrainingFeed />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;

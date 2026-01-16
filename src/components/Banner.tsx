import { Link } from "react-router-dom";
import { bannerData } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const Banner = () => {
  return (
    <div
      className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerData.image})` }}
    >
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-card mb-2">
          {bannerData.title}
        </h2>
        <p className="text-lg text-card/90 mb-6">{bannerData.subtitle}</p>
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="rounded-xl"
        >
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Banner;

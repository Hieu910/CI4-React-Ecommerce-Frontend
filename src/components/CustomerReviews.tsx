import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { CustomerReview } from "@/data/mockData";

interface CustomerReviewsProps {
  reviews: CustomerReview[];
}

const CustomerReviews = ({ reviews }: CustomerReviewsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
        What Our Customers Say
      </h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card shadow-md text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card shadow-md text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-80 bg-card rounded-xl p-6"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">
                "{review.comment}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;

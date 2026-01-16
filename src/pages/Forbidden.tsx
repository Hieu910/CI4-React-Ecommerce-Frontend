import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <ShieldX className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-2">403</h1>
      <h2 className="text-xl text-muted-foreground mb-6">Access Forbidden</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Forbidden;

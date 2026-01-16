import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "@/store";
import { Loader2 } from "lucide-react";

const AdminRoute = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  console.log(user);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 1) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

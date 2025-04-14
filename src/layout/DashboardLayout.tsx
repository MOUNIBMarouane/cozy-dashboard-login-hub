
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;


import { useEffect } from "react";
import { getCurrentUser, initAuth } from "@/lib/auth";
import DashboardStats from "@/components/dashboard/DashboardStats";

const Dashboard = () => {
  const user = getCurrentUser();

  useEffect(() => {
    // Initialize auth from localStorage if needed
    initAuth();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}! Here's an overview of your account.
        </p>
      </div>
      
      <DashboardStats />
    </div>
  );
};

export default Dashboard;

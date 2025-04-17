
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import documentService from "@/services/documentService";
import { CircuitNavigation } from "@/components/navigation/CircuitNavigation";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { CompletionRateCard } from "@/components/dashboard/CompletionRateCard";
import { ActivityScoreCard } from "@/components/dashboard/ActivityScoreCard";
import { DocumentActivityChart } from "@/components/dashboard/DocumentActivityChart";
import { WeeklyStatsChart } from "@/components/dashboard/WeeklyStatsChart";
import { RecentDocumentsCard } from "@/components/dashboard/RecentDocumentsCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { sampleChartData, sampleBarData } from "@/components/dashboard/chartData";
import { User } from "@/models/auth";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Convert UserInfo to User type for compatibility
  const userForComponents: User | null = user ? {
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    id: user.id?.toString() || '',
    role: user.role,
    profilePicture: user.profilePicture
  } : null;

  const { data: recentDocuments } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: () => documentService.getRecentDocuments(5),
    enabled: !!user,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-blue-400/80">
        <span>Home</span>
        <span>/</span>
        <span className="text-blue-100">Dashboard</span>
      </div>
      
      <DashboardStats documentsCount={recentDocuments?.length || 0} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WelcomeCard user={userForComponents} />
        <CompletionRateCard />
        <ActivityScoreCard user={userForComponents} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DocumentActivityChart data={sampleChartData} />
        <WeeklyStatsChart data={sampleBarData} />
      </div>
      
      {recentDocuments && recentDocuments.length > 0 && (
        <RecentDocumentsCard documents={recentDocuments} />
      )}
    </div>
  );
}

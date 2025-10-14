import StatCard from "./components/stat-card";
import { api, Analytics } from "@/lib/api";
import { BarChart, ClipboardCheck, AlertTriangle, ShieldCheck } from "lucide-react";

async function getAnalyticsData(): Promise<Analytics> {
  // In a real app, you'd pass the user's ID
  const data = await api.getAnalytics("user123");
  return data;
}

export default async function DashboardPage() {
  const analytics = await getAnalyticsData();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
        <p className="text-muted-foreground">An overview of your health and prescriptions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Prescriptions Verified"
          value={analytics.totalVerified.toString()}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Active Medications"
          value={analytics.activeMedications.toString()}
          icon={BarChart}
          description="Currently in your inventory"
        />
        <StatCard
          title="Upcoming Alerts"
          value={analytics.upcomingAlerts.toString()}
          icon={AlertTriangle}
          description="Low stock or expiring soon"
        />
        <StatCard
          title="Average Safety Score"
          value={`${analytics.averageSafetyScore}%`}
          icon={ShieldCheck}
          description="Across all verified prescriptions"
        />
      </div>
       {/* Other dashboard components can be added here */}
    </div>
  );
}

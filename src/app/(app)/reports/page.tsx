import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionSummaryChart, HealthTrendChart, AlertsChart } from "./components/charts";

export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports &amp; Insights</h1>
                <p className="text-muted-foreground">Visualize your health and prescription data.</p>
            </div>

            <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                    <TabsTrigger value="summary">Prescription Summary</TabsTrigger>
                    <TabsTrigger value="alerts">Upcoming Alerts</TabsTrigger>
                    <TabsTrigger value="trends">Health Trends</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4">
                    <PrescriptionSummaryChart />
                </TabsContent>
                <TabsContent value="alerts" className="mt-4">
                    <AlertsChart />
                </TabsContent>
                <TabsContent value="trends" className="mt-4">
                    <HealthTrendChart />
                </TabsContent>
            </Tabs>
        </div>
    );
}

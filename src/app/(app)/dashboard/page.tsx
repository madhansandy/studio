"use client";

import { useMemo } from 'react';
import StatCard from "./components/stat-card";
import { BarChart, ClipboardCheck, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Prescription, InventoryItem } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/prescriptions`);
  }, [firestore, user]);
  const { data: prescriptions, isLoading: prescriptionsLoading } = useCollection<Prescription>(prescriptionsQuery);

  const inventoryQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/medications`);
  }, [firestore, user]);
  const { data: inventory, isLoading: inventoryLoading } = useCollection<InventoryItem>(inventoryQuery);

  const analytics = useMemo(() => {
    const totalVerified = prescriptions?.length ?? 0;
    const activeMedications = inventory?.filter(item => item.status === 'In Stock' || item.status === 'Low Stock').length ?? 0;
    
    const upcomingAlerts = inventory?.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return item.status === 'Low Stock' || (expiryDate <= thirtyDaysFromNow && item.status !== 'Expired');
    }).length ?? 0;
    
    const averageSafetyScore = totalVerified > 0
      ? Math.round((prescriptions?.reduce((sum, p) => sum + p.safetyScore, 0) ?? 0) / totalVerified)
      : 0;

    return {
      totalVerified,
      activeMedications,
      upcomingAlerts,
      averageSafetyScore,
    };
  }, [prescriptions, inventory]);

  const isLoading = prescriptionsLoading || inventoryLoading;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

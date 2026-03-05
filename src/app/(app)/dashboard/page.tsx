"use client";

import { useMemo } from 'react';
import StatCard from "./components/stat-card";
import { MessageSquare, ClipboardCheck, AlertTriangle, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { Prescription, InventoryItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
    const activeMedications = inventory?.length ?? 0;
    
    const upcomingAlerts = inventory?.filter(item => {
        // Simple logic for "upcoming alerts" based on status or close expiry
        return item.status === 'Low Stock' || item.status === 'Expired';
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
      <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your health profile today.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask Assistant
                </Link>
            </Button>
            <Button asChild>
                <Link href="/upload">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    New Verification
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Verifications"
          value={analytics.totalVerified.toString()}
          icon={ClipboardCheck}
          description="Total prescriptions checked"
        />
        <StatCard
          title="Medications"
          value={analytics.activeMedications.toString()}
          icon={ShieldCheck}
          description="In your current inventory"
        />
        <StatCard
          title="Safety Score"
          value={`${analytics.averageSafetyScore}%`}
          icon={ShieldCheck}
          description="Average health safety rating"
        />
        <StatCard
          title="Active Alerts"
          value={analytics.upcomingAlerts.toString()}
          icon={AlertTriangle}
          description="Requires your attention"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your most recent prescription verifications.</CardDescription>
          </CardHeader>
          <CardContent>
            {prescriptions && prescriptions.length > 0 ? (
                <div className="space-y-4">
                    {prescriptions.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">{p.name}</span>
                                <span className="text-xs text-muted-foreground">{p.uploadTimestamp?.toDate().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${p.safetyScore > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {p.safetyScore}%
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    ))}
                    <Button asChild variant="ghost" className="w-full text-primary hover:text-primary">
                        <Link href="/prescriptions">View all history</Link>
                    </Button>
                </div>
            ) : (
                <div className="py-8 text-center text-muted-foreground">
                    <p>No activity yet.</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Medication Summary</CardTitle>
            <CardDescription>Overview of your current stock levels.</CardDescription>
          </CardHeader>
          <CardContent>
             {inventory && inventory.length > 0 ? (
                <div className="space-y-4">
                    {inventory.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                             <span className="font-semibold text-sm">{item.name}</span>
                             <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {item.status}
                                </span>
                                <span className="text-sm font-medium">{item.stock} days left</span>
                             </div>
                        </div>
                    ))}
                    <Button asChild variant="ghost" className="w-full text-primary hover:text-primary">
                        <Link href="/inventory">Manage inventory</Link>
                    </Button>
                </div>
             ) : (
                <div className="py-8 text-center text-muted-foreground">
                    <p>No inventory items tracked.</p>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
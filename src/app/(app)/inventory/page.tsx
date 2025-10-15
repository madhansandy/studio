"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/api";
import InventoryTable from "./components/inventory-table";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import { Loader2 } from "lucide-react";


export default function InventoryPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const inventoryQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/medications`);
    }, [user, firestore]);
    const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryQuery);

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
                <h1 className="text-3xl font-bold tracking-tight">Stock &amp; Alerts</h1>
                <p className="text-muted-foreground">Manage your medicine inventory and set up alerts.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                   {inventory ? (
                        <InventoryTable data={inventory} />
                   ) : (
                       <Card>
                           <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                               <h3 className="text-xl font-semibold">No Inventory Found</h3>
                               <p className="text-muted-foreground">Add medications to your inventory to see them here.</p>
                           </CardContent>
                       </Card>
                   )}
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Alert Settings</CardTitle>
                            <CardDescription>Get notified when your medicine stock is running low.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="threshold">Low Stock Threshold (days)</Label>
                                    <Input id="threshold" type="number" defaultValue="3" />
                                </div>
                                <Button>Save Settings</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

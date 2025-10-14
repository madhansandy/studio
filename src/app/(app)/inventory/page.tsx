import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, InventoryItem } from "@/lib/api";
import InventoryTable from "./components/inventory-table";

async function getInventory(): Promise<InventoryItem[]> {
    // In a real app, you'd pass a user ID
    return api.getInventory("user123");
}

export default async function InventoryPage() {
    const inventory = await getInventory();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Stock &amp; Alerts</h1>
                <p className="text-muted-foreground">Manage your medicine inventory and set up alerts.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <InventoryTable data={inventory} />
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

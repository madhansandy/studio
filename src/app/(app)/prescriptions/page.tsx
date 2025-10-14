import PrescriptionCard from "./components/prescription-card";
import { api, Prescription } from "@/lib/api";

async function getPrescriptions(): Promise<Prescription[]> {
    // In a real app, you'd pass a user ID
    return api.getPrescriptions("user123");
}

export default async function PrescriptionsPage() {
    const prescriptions = await getPrescriptions();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Verified Prescriptions</h1>
                <p className="text-muted-foreground">Review your past prescription verifications and safety scores.</p>
            </div>
            {prescriptions.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {prescriptions.map((p) => (
                        <PrescriptionCard key={p.id} prescription={p} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
                    <h3 className="text-xl font-semibold">No Prescriptions Found</h3>
                    <p className="text-muted-foreground">Upload a prescription to get started.</p>
                </div>
            )}
        </div>
    );
}

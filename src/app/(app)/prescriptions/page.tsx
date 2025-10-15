"use client";

import PrescriptionCard from "./components/prescription-card";
import { Prescription } from "@/lib/api";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2 } from "lucide-react";

export default function PrescriptionsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const prescriptionsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/prescriptions`), orderBy("uploadTimestamp", "desc"));
    }, [user, firestore]);

    const { data: prescriptions, isLoading } = useCollection<Prescription>(prescriptionsQuery);
    
    const formattedPrescriptions = prescriptions?.map(p => ({
        ...p,
        date: p.uploadTimestamp?.toDate().toLocaleDateString() ?? 'N/A'
    }));

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
                <h1 className="text-3xl font-bold tracking-tight">Verified Prescriptions</h1>
                <p className="text-muted-foreground">Review your past prescription verifications and safety scores.</p>
            </div>
            {formattedPrescriptions && formattedPrescriptions.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {formattedPrescriptions.map((p) => (
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

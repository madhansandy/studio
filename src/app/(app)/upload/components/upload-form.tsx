"use client";

import { useState } from "react";
import { getPrescriptionSafetyScore, PrescriptionSafetyScoreOutput } from "@/ai/flows/prescription-safety-score";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, FileImage, FileText, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadForm() {
    const { toast } = useToast();
    const [prescriptionText, setPrescriptionText] = useState("");
    const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PrescriptionSafetyScoreOutput | null>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPrescriptionImage(file);
        }
    };
    
    const fileToDataURI = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!prescriptionText && !prescriptionImage) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please provide prescription text or an image.",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            let image_data_uri;
            if (prescriptionImage) {
                image_data_uri = await fileToDataURI(prescriptionImage);
            }
            
            const score = await getPrescriptionSafetyScore({
                prescriptionText: prescriptionText || undefined,
                prescriptionImage: image_data_uri,
            });

            setResult(score);
            toast({
                title: "Verification Complete",
                description: `Your prescription has a safety score of ${score.safetyScore}.`,
            });
        } catch (error) {
            console.error("Verification failed:", error);
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: "An error occurred while verifying your prescription.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getSafetyInfo = (score: number) => {
        if (score >= 80) return { Icon: CheckCircle2, color: "text-green-600", label: "Safe" };
        if (score >= 50) return { Icon: ShieldAlert, color: "text-yellow-600", label: "Caution" };
        return { Icon: AlertTriangle, color: "text-red-600", label: "High Risk" };
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Enter Prescription Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="prescription-text"><FileText className="inline-block mr-2 h-4 w-4" />Paste Prescription Text</Label>
                            <Textarea
                                id="prescription-text"
                                placeholder="e.g., Lisinopril 10mg, take one tablet daily..."
                                value={prescriptionText}
                                onChange={(e) => setPrescriptionText(e.target.value)}
                                rows={5}
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prescription-image"><FileImage className="inline-block mr-2 h-4 w-4" />Upload Prescription Image</Label>
                            <Input
                                id="prescription-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                            {prescriptionImage && <p className="text-sm text-muted-foreground">Selected: {prescriptionImage.name}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Prescription"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Verification Result</CardTitle>
                    <CardDescription>The AI-powered safety score and any identified issues will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4">Analyzing your prescription...</p>
                        </div>
                    )}
                    {!isLoading && result && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                                {(() => {
                                    const { Icon, color, label } = getSafetyInfo(result.safetyScore);
                                    return (
                                        <>
                                            <Icon className={cn("h-16 w-16", color)} />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Prescription Safety Score</p>
                                                <p className="text-4xl font-bold">{result.safetyScore}<span className="text-2xl text-muted-foreground">/100</span></p>
                                                <p className={cn("font-semibold", color)}>{label}</p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                            <div>
                                <h4 className="font-semibold">Identified Issues:</h4>
                                {result.issues.length > 0 ? (
                                    <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                                        {result.issues.map((issue, index) => (
                                            <li key={index} className="bg-destructive/10 p-2 rounded-md">{issue}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-2 text-sm text-muted-foreground">No significant issues found.</p>
                                )}
                            </div>
                        </div>
                    )}
                     {!isLoading && !result && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                           <p>Your results will be shown here after verification.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

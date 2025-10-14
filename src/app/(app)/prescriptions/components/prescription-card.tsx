import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Prescription } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface PrescriptionCardProps {
  prescription: Prescription;
}

export default function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  const getSafetyInfo = (score: number): {
    color: string,
    bgColor: string,
    borderColor: string,
    Icon: React.ElementType,
    text: string
  } => {
    if (score >= 80) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        Icon: CheckCircle2,
        text: "Safe"
      };
    }
    if (score >= 50) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        Icon: ShieldAlert,
        text: "Caution"
      };
    }
    return {
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      Icon: AlertTriangle,
      text: "High Risk"
    };
  };

  const safetyInfo = getSafetyInfo(prescription.safetyScore);

  return (
    <Card className={cn("flex flex-col", safetyInfo.borderColor)}>
      <CardHeader className={cn("pb-4", safetyInfo.bgColor)}>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-lg">{prescription.name}</CardTitle>
                <CardDescription>Verified on: {prescription.date}</CardDescription>
            </div>
            <Badge variant="outline" className={cn("border-2 text-sm", safetyInfo.borderColor, safetyInfo.color, safetyInfo.bgColor)}>
                {safetyInfo.text}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <div className="flex items-center gap-4">
          <div className={cn("flex flex-col items-center p-2 rounded-lg", safetyInfo.bgColor, safetyInfo.color)}>
            <safetyInfo.Icon className="h-8 w-8" />
            <span className="text-2xl font-bold">{prescription.safetyScore}</span>
            <span className="text-xs font-medium">PSS</span>
          </div>
          <div>
            <h4 className="font-semibold">Identified Issues:</h4>
            {prescription.issues.length > 0 ? (
              <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                {prescription.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">No significant issues found.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
          <p className="text-xs text-muted-foreground">*PSS: Prescription Safety Score</p>
      </CardFooter>
    </Card>
  );
}

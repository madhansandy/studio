import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Map, Navigation } from "lucide-react";

export default function LocatorPage() {
    const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Healthcare Locator</h1>
                <p className="text-muted-foreground">Find nearby medical shops, hospitals, and clinics.</p>
            </div>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Nearby Facilities</CardTitle>
                    <CardDescription>Map integration is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted">
                        {mapImage ? (
                            <Image 
                                src={mapImage.imageUrl} 
                                alt={mapImage.description} 
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint={mapImage.imageHint}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Map className="w-16 h-16 text-muted-foreground" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-4 right-4">
                            <Button disabled>
                                <Navigation className="mr-2 h-4 w-4" />
                                Navigate
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Map, Navigation, Search, Hospital } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const nearbyPlaces = [
    { name: 'City General Hospital', type: 'Hospital', distance: '1.2 miles' },
    { name: 'Community Pharmacy', type: 'Pharmacy', distance: '0.8 miles' },
    { name: 'Downtown Clinic', type: 'Clinic', distance: '2.5 miles' },
];

export default function LocatorPage() {
    const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Healthcare Locator</h1>
                <p className="text-muted-foreground">Find nearby medical shops, hospitals, and clinics.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                         <CardHeader>
                            <CardTitle>Nearby Facilities</CardTitle>
                            <CardDescription>Enter a location to find healthcare facilities near you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex w-full items-center space-x-2 mb-4">
                                <Input type="text" placeholder="Enter your city or zip code" />
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
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
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-muted-foreground">Map integration requires a Google Maps API key.</p>
                        </CardFooter>
                    </Card>
                </div>
                 <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Results</CardTitle>
                             <CardDescription>Showing results for "Current Location"</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-4">
                                {nearbyPlaces.map((place, index) => (
                                    <li key={index}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold">{place.name}</h4>
                                                <p className="text-sm text-muted-foreground">{place.type} &bull; {place.distance}</p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Navigation className="mr-2 h-4 w-4" />
                                                Directions
                                            </Button>
                                        </div>
                                         {index < nearbyPlaces.length -1 && <Separator className="mt-4" />}
                                    </li>
                                ))}
                           </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Map, Navigation, Search, MapPin, Loader2, Hospital, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Facility {
    name: string;
    type: 'Hospital' | 'Pharmacy' | 'Clinic';
    distance: string;
    address: string;
}

const initialPlaces: Facility[] = [
    { name: 'City General Hospital', type: 'Hospital', distance: '1.2 miles', address: '123 Healthcare Way' },
    { name: 'Community Pharmacy', type: 'Pharmacy', distance: '0.8 miles', address: '456 Main St' },
    { name: 'Downtown Clinic', type: 'Clinic', distance: '2.5 miles', address: '789 Wellness Blvd' },
];

export default function LocatorPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLocating, setIsLocating] = useState(false);
    const [facilities, setFacilities] = useState<Facility[]>(initialPlaces);
    const { toast } = useToast();
    
    const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsLocating(true);
        // Simulate API call
        setTimeout(() => {
            setIsLocating(false);
            toast({
                title: "Search Updated",
                description: `Showing results for "${searchQuery}"`,
            });
        }, 1000);
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            toast({
                variant: "destructive",
                title: "Not Supported",
                description: "Geolocation is not supported by your browser.",
            });
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                setSearchQuery(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                toast({
                    title: "Location Found",
                    description: "Updated results based on your current coordinates.",
                });
            },
            (error) => {
                setIsLocating(false);
                toast({
                    variant: "destructive",
                    title: "Location Access Denied",
                    description: "Please enable location permissions to find nearby facilities automatically.",
                });
            }
        );
    };

    const getIcon = (type: Facility['type']) => {
        switch (type) {
            case 'Hospital': return <Hospital className="h-4 w-4 text-primary" />;
            case 'Pharmacy': return <Pill className="h-4 w-4 text-accent" />;
            default: return <MapPin className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Healthcare Locator</h1>
                    <p className="text-muted-foreground">Find nearby medical shops, hospitals, and clinics.</p>
                </div>
                <Button variant="outline" onClick={handleUseMyLocation} disabled={isLocating}>
                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    Use My Location
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                         <CardHeader>
                            <CardTitle>Nearby Facilities</CardTitle>
                            <CardDescription>Enter a location or use GPS to find healthcare facilities near you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-4">
                                <Input 
                                    type="text" 
                                    placeholder="Enter city, zip code, or address" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button type="submit" disabled={isLocating}>
                                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                                    Search
                                </Button>
                            </form>
                            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted border">
                                {mapImage ? (
                                    <Image 
                                        src={mapImage.imageUrl} 
                                        alt={mapImage.description} 
                                        fill
                                        className="object-cover"
                                        data-ai-hint={mapImage.imageHint}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Map className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                {isLocating && (
                                    <div className="absolute inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="text-sm font-medium">Updating Map...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 py-3">
                            <p className="text-xs text-muted-foreground italic">
                                Map integration uses simulated geolocation for this preview.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
                 <div className="flex flex-col gap-4">
                    <Card className="flex-grow">
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                             <CardDescription>
                                {searchQuery ? `Showing facilities near "${searchQuery}"` : "Showing nearby facilities"}
                             </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-6">
                                {facilities.map((place, index) => (
                                    <li key={index} className="group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-3">
                                                <div className="mt-1 p-2 rounded-full bg-primary/10">
                                                    {getIcon(place.type)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold group-hover:text-primary transition-colors">{place.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{place.type} &bull; {place.distance}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{place.address}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                                                <Navigation className="h-4 w-4" />
                                                <span className="sr-only">Directions</span>
                                            </Button>
                                        </div>
                                         {index < facilities.length - 1 && <Separator className="mt-6" />}
                                    </li>
                                ))}
                           </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">View All Results</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from "react";
import TopNavbar from "../topNavBar/TopNavbar.jsx";
import { getGuides } from "@/APIs/guides.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { ArrowDownAz, ClockArrowDown, ChevronRight } from "lucide-react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@/components/ui/tooltip.jsx";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useQuery } from "react-query";
import GuidesList from "./components/GuideList.jsx";


export default function GuidePage() {

    const { data: selfGuides, isLoading, refetch } = useQuery(
        ["selfGuides"],
        () => getGuides({self: true}),
        {
            refetchOnWindowFocus: false,
        }
    )

    const handleDeleteGuide = () => {
        refetch();
    }

    const [sortDate, setSortDate] = useState(false);
    
    

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <Collapsible defaultOpen>
                            <div className="flex justify-between mb-8">
                                <div className="flex gap-x-2">
                                    <CollapsibleTrigger className="flex items-center gap-x-2 group">
                                        <h1 className="text-3xl font-bold text-center">Your Guides</h1>
                                        <ChevronRight className="h-5 w-5 transition-transform group-data-[state=open]:rotate-90" />
                                    </CollapsibleTrigger>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="[&_svg]:size-5"
                                                onClick={() => setSortDate(!sortDate)}
                                            >
                                                {sortDate ? (
                                                    <ClockArrowDown className="h-6 w-6" />
                                                ) : (
                                                    <ArrowDownAz className="h-6 w-6" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {sortDate ? "Most Recent Guides" : "Sort Alphabetically"}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Button asChild className="mr-4 sm:inline-flex">
                                    <NavLink
                                        to="/yourTrips"
                                        className="border-transparent inline-flex text-sm font-semibold"
                                    >
                                        Create Guide
                                    </NavLink>
                                </Button>
                            </div>
                            <CollapsibleContent className="">
                                {!isLoading ?
                                    selfGuides && selfGuides.length > 0
                                        ?
                                        (<GuidesList 
                                            guides={selfGuides} 
                                            sort={sortDate} 
                                            self={true}
                                            onDelete={handleDeleteGuide}
                                            />)
                                        : (
                                            <div className="text-center text-gray-500">
                                                <p className="text-lg">You have no guides yet.</p>
                                                <p className="text-sm">Create your first guide to share your adventures!</p>
                                            </div>
                                        )
                                    : (
                                        <GuideListLoadingSkeleton />
                                    )}
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    <div className="flex justify-start">
                        <h1 className="text-3xl font-bold text-center mb-6">Recommended Guides</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

const GuideListLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-slate-100 rounded-lg shadow overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                    <Skeleton className="h-7 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        ))}
    </div>
);
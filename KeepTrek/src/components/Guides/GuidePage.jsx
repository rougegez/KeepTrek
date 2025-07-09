import { useState, useMemo, useEffect } from "react"
import { useQuery } from "react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    SlidersHorizontal,
    Grid3X3,
    List,
    ArrowUpDown,
    MapPin,
    Clock,
    Users,
    Star,
    TrendingUp,
    Plus,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Heart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

import TopNavbar from "../topNavBar/TopNavbar.jsx"
import GuidesList from "./components/GuideList.jsx"
import GuideCard from "./components/GuideCard.jsx"
import { getFilterData, getGuides } from "@/APIs/guides.js"
import { getUserProfile } from "@/APIs/users.js"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthProvider.jsx"

export default function GuidePage() {
    // State management
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("recent")
    const [selectedLocations, setSelectedLocations] = useState([])
    const [durationRange, setDurationRange] = useState([1, 30])
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(12)

    // Navigate hook
    const navigate = useNavigate()

    // Auth
    const { user } = useAuth()

    // Build query parameters for API calls
    const buildQueryParams = () => {
        const params = {
            page: currentPage,
            page_size: pageSize,
        }

        if (searchQuery) {
            params.title = searchQuery
        }

        if (selectedLocations.length === 1) {
            params.location = selectedLocations[0]
        }

        return params
    }

    // Data fetching with proper parameters
    const {
        data: selfGuides,
        isLoading: isSelfLoading,
        refetch: refetchSelf,
    } = useQuery(["selfGuides"], () => getGuides({ self: true }), { refetchOnWindowFocus: false })

    const {
        data: allGuidesData,
        isLoading: isAllGuidesLoading,
    } = useQuery(["allGuides"], () => getGuides({ self: false }), {
        refetchOnWindowFocus: false,
    })

    const {
        data: searchedGuidesData,
        isLoading: isAllLoading,
        refetch: refetchAllGuides,
    } = useQuery(
        ["searchedGuides", currentPage, searchQuery, selectedLocations],
        () => getGuides({ self: false, ...buildQueryParams() }),
        {
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        },
    )

    const { data: filterData, isLoading: isFilterLoading } = useQuery(["filterData"], () => getFilterData(), {
        refetchOnWindowFocus: false,
    })

    // Get user profile for saved guides
    const { data: userProfile, isLoading: isUserLoading } = useQuery(["userProfile", user], () => getUserProfile(user), {
        refetchOnWindowFocus: false,
    })

    // Get saved guides based on user profile
    const { data: savedGuidesData, isLoading: isSavedLoading } = useQuery(
        ["savedGuides", userProfile?.saved],
        async () => {
            if (!userProfile?.saved || userProfile.saved.length === 0) {
                return { items: [] }
            }

            const savedGuides = await getGuides({ guide_id: userProfile.saved, self: false })
            return { items: savedGuides }
        },
        {
            enabled: !!userProfile?.saved,
            refetchOnWindowFocus: false,
        },
    )

    // Client-side filtering for duration (since backend doesn't support it yet)
    const filteredGuides = useMemo(() => {
        if (!searchedGuidesData?.items) return []

        let filtered = searchedGuidesData.items

        // Duration filter (client-side)
        filtered = filtered.filter(
            (guide) => guide.duration.days >= durationRange[0] && guide.duration.days <= durationRange[1],
        )

        // Sort (client-side for additional sorting options)
        switch (sortBy) {
            case "recent":
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                break
            case "alphabetical":
                filtered.sort((a, b) => a.title.localeCompare(b.title))
                break
            case "popular":
                filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
                break
        }

        return filtered
    }, [searchedGuidesData, durationRange, sortBy])

    const handleLocationToggle = (location) => {
        setSelectedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
        setCurrentPage(1) // Reset to first page when filters change
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedLocations([])
        setDurationRange([1, 30])
        setCurrentPage(1)
    }

    const activeFiltersCount =
        selectedLocations.length + (durationRange[0] !== 1 || durationRange[1] !== 30 ? 1 : 0) + (searchQuery ? 1 : 0)

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)
            refetchAllGuides()
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, selectedLocations])

    // Pagination calculations
    const totalPages = Math.ceil((searchedGuidesData?.total || 0) / pageSize)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <TopNavbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Guides</h1>
                            <p className="text-gray-600 text-lg">Discover amazing destinations through community-created guides</p>
                        </div>
                        <Button size="sm" className="font-semibold" onClick={() => navigate("/yourTrips")}>
                            <Plus className="w-5 h-5" />
                            Create Guide
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4 bg-gradient-to-r from-primary to-purple-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm">Total Guides</p>
                                <p className="text-2xl font-bold">{allGuidesData?.total || 0}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-primary-200" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Your Guides</p>
                                <p className="text-2xl font-bold text-gray-900">{selfGuides?.length || 0}</p>
                            </div>
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Saved Guides</p>
                                <p className="text-2xl font-bold text-gray-900">{userProfile?.saved?.length || 0}</p>
                            </div>
                            <Bookmark className="w-8 h-8 text-gray-400" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Liked Guides</p>
                                <p className="text-2xl font-bold text-gray-900">{userProfile?.likes?.length}</p>
                            </div>
                            <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                    </Card>
                </div>

                {/* Tabs for Different Guide Categories - Moved to top */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            All Guides
                        </TabsTrigger>
                        <TabsTrigger value="yours" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Your Guides
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            Saved Guides
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-6">
                        {/* Search and Filter Bar - Only for All Guides */}
                        <Card className="p-4 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Search guides by title, description, or location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex gap-2">
                                    {/* Sort Select */}
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-40 h-12">
                                            <ArrowUpDown className="w-4 h-4 mr-2" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">Most Recent</SelectItem>
                                            <SelectItem value="alphabetical">A-Z</SelectItem>
                                            <SelectItem value="popular">Most Views</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Filter Sheet */}
                                    <Sheet open={showFilters} onOpenChange={setShowFilters}>
                                        <SheetTrigger asChild>
                                            <Button className="h-12">
                                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                                Filters
                                                {activeFiltersCount > 0 && (
                                                    <Badge className="absolute -top-2 -right-2 text-white text-xs px-2 py-1">
                                                        {activeFiltersCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="w-80">
                                            <SheetHeader>
                                                <SheetTitle>Filter Guides</SheetTitle>
                                                <SheetDescription>Refine your search with these filters</SheetDescription>
                                            </SheetHeader>

                                            <div className="mt-6 space-y-6">
                                                {/* Location Filter */}
                                                <div>
                                                    <h3 className="font-semibold mb-3 flex items-center">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        Locations
                                                    </h3>
                                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                                        {filterData?.locations?.map((locationObj) => (
                                                            <div key={locationObj.location} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={locationObj.location}
                                                                    checked={selectedLocations.includes(locationObj.location)}
                                                                    onCheckedChange={() => handleLocationToggle(locationObj.location)}
                                                                />
                                                                <label
                                                                    htmlFor={locationObj.location}
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                                                                >
                                                                    {locationObj.location}
                                                                    <span className="text-gray-400 ml-1">({locationObj.count})</span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Duration Filter */}
                                                <div>
                                                    <h3 className="font-semibold mb-3 flex items-center">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        Duration (Days)
                                                    </h3>
                                                    <div className="px-2">
                                                        <Slider
                                                            value={durationRange}
                                                            onValueChange={setDurationRange}
                                                            max={30}
                                                            min={1}
                                                            step={1}
                                                            className="w-full"
                                                        />
                                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                                            <span>
                                                                {durationRange[0]} day{durationRange[0] !== 1 ? "s" : ""}
                                                            </span>
                                                            <span>
                                                                {durationRange[1]} day{durationRange[1] !== 1 ? "s" : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Clear Filters */}
                                                <Button
                                                    variant="outline"
                                                    onClick={clearFilters}
                                                    className="w-full bg-transparent"
                                                    disabled={activeFiltersCount === 0}
                                                >
                                                    Clear All Filters
                                                </Button>
                                            </div>
                                        </SheetContent>

                                    </Sheet>
                                </div>
                            </div>
                        </Card>

                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                All Travel Guides
                                <span className="text-gray-500 text-lg ml-2">({searchedGuidesData?.total || 0})</span>
                            </h2>
                        </div>

                        {!isAllLoading ? (
                            filteredGuides.length > 0 ? (
                                <>
                                    <motion.div
                                        layout
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        <AnimatePresence>
                                            {filteredGuides.map((guide) => (
                                                <motion.div
                                                    key={guide.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <GuideCard guide={guide} self={false} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                                disabled={!hasPrevPage}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Previous
                                            </Button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className="w-10 h-10"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    )
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                                disabled={!hasNextPage}
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Card className="p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <Search className="w-16 h-16 mx-auto mb-4" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
                                    <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                                    <Button onClick={clearFilters} variant="outline">
                                        Clear Filters
                                    </Button>
                                </Card>
                            )
                        ) : (
                            <GuideListLoadingSkeleton />
                        )}
                    </TabsContent>

                    <TabsContent value="yours" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Your Travel Guides
                                <span className="text-gray-500 text-lg ml-2">({selfGuides?.length || 0})</span>
                            </h2>
                        </div>

                        {!isSelfLoading ? (
                            selfGuides && selfGuides.length > 0 ? (
                                <GuidesList guides={selfGuides} sort={sortBy === "recent"} self={true} onDelete={refetchSelf} />
                            ) : (
                                <Card className="p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <Plus className="w-16 h-16 mx-auto mb-4" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides yet</h3>
                                    <p className="text-gray-600 mb-4">Create your first guide to share your travel experiences</p>
                                    <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => navigate("/yourTrips")}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Guide
                                    </Button>
                                </Card>
                            )
                        ) : (
                            <GuideListLoadingSkeleton />
                        )}
                    </TabsContent>

                    <TabsContent value="saved" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Saved Guides
                                <span className="text-gray-500 text-lg ml-2">({savedGuidesData?.items?.length || 0})</span>
                            </h2>
                        </div>

                        {!isSavedLoading ? (
                            savedGuidesData?.items && savedGuidesData.items.length > 0 ? (
                                <GuidesList guides={savedGuidesData.items} sort={false} self={false} />
                            ) : (
                                <Card className="p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <Bookmark className="w-16 h-16 mx-auto mb-4" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved guides</h3>
                                    <p className="text-gray-600 mb-4">Save guides you like to access them later</p>
                                    <Button variant="outline" onClick={() => setActiveTab("all")}>
                                        Browse All Guides
                                    </Button>
                                </Card>
                            )
                        ) : (
                            <GuideListLoadingSkeleton />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// Loading skeleton component
const GuideListLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="overflow-hidden">  
                <div className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200" />
                    <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            </Card>
        ))}
    </div>
)

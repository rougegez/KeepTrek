import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { DateRangePicker } from "@/components/ui/datepicker.jsx"

import { Input } from "@/components/ui/input"

import TopNavbar from "./TopNavbar.jsx"

export default function CreateTrip() {
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <Card className="mx-auto max-w-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-5xl font-bold">Create Your Trip</CardTitle>
                        <CardDescription>Plan your next adventure!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="tripName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Trip Name
                                </label>
                                <Input
                                    id="tripName"
                                    placeholder="Enter trip name"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                    Trip Dates 
                                </label>
                                <label className="text-sm font-medium text-gray-700">
                                Days: { (dateRange.from === undefined) ? 0 : (dateRange.to - dateRange.from)/(1000 * 60 * 60 * 24)}
                                </label>
                                </div>
                                <DateRangePicker
                                    value={dateRange}
                                    onValueChange={setDateRange}
                                />
                            </div>
                            <Button
                                className="w-full bg-[#4DB6AC] hover:bg-[#37827a] text-white"
                                type="submit"
                            >
                                Create Trip
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


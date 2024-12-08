'use client'

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { DateFinderCalendar } from './DateFinderCalendar'
import { SidebarProvider } from '../ui/sidebar'
import AppSidebar from '../Sidebar/Sidebar'
import { cn } from '@/lib/utils'


export default function DateFinder() {
    const [month, setMonth] = useState(new Date(2024, 11, 1))

    const calculateDaysAndNights = (from, to) => {
        if (from && to) {
            const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
            return `${days} days, ${days - 1} nights`
        }
        return "X days, X nights"
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="min-h-screen w-full p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10">Select your available dates!</h1>

                <div className="max-w-3xl mx-auto mb-8 p-4">

                    <div className="flex justify-center">
                        <DateFinderCalendar
                        mode="multiple"/>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto space-y-4 p-4">
                    <h2 className="text-2xl font-semibold mb-4">Suggested trip dates</h2>
                    <div className="space-y-4">
                        {[
                        ].map((range, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 border rounded-md">
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {calculateDaysAndNights(range.value.from, range.value.to)}
                                    </p>
                                </div>
                                <Button variant="outline">Select</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}


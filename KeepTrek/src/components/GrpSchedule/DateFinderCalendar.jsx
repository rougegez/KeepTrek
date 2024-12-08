import { Calendar } from "@/components/ui/calendar"

function DateFinderCalendar({...props}) {
    return (
        <Calendar
            className="rounded-md
                            [--day-size:3rem] md:[--day-size:4rem] 
                            [&_.rdp-cell]:p-0 [&_.rdp-button]:w-[var(--day-size)] 
                            [&_.rdp-button]:h-[var(--day-size)] [&_.rdp-button]:text-lg 
                            [&_.rdp-head_th]:p-0 [&_.rdp-head_th]:font-semibold [&_.rdp-head_th]:text-lg 
                            [&_.rdp-head_th]:h-0] [&_.rdp-head_th]:w-[var(--day-size)]"
            classNames={{
                // Refer to the imported calendar.jsx to get all the classnames to customise, right click go-to-source definition
                nav_button_previous: "absolute left-1 border-none shadow-none hover:bg-transparent hover:shadow-none",
                nav_button_next: "absolute right-1 border-none shadow-none hover:bg-transparent hover:shadow-none",
                caption_label: "text-2xl font-medium",
            }}
            {...props}
        />
    )
} 
DateFinderCalendar.displayName = "DateFinderCalendar"

export {DateFinderCalendar}
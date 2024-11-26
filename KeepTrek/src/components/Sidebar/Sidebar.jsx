import styles from './Sidebar.module.css'
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
}
  from "@/components/ui/collapsible";

import {NavLink } from 'react-router-dom';

// Overview items
const OverviewItems = [
  {
    title: "Trip Summary",
    url: "",
  },
  {
    title: "Acommodation",
    url: "",
  },
  {
    title: "Trip Buddy",
    url: "",
  },
  {
    title: "Notes",
    url: "",
  },
  {
    title: "Attachments",
    url: "",
  },
]

// Itinerary items
const ItineraryItems = [
  {
    title: "Day 1",
    url: "",
  },
  {
    title: "Day 2",
    url: "",
  },
  {
    title: "Day 3",
    url: "",
  },
  {
    title: "Day 4",
    url: "",
  },
  {
    title: "Day 5",
    url: "",
  }
]

export const AppSidebar = () => {
  return (
    <Sidebar className="h-screen sticky top-0 bg-white drop-shadow-keepTrek overflow-y-auto z-50">
      <SidebarHeader>
        <a href="/"><img src='../src/assets/KeepTrek.png' alt="KeepTrek Logo" /></a>
        <span className="text-[32px] text-black font-semibold ml-4">Library</span>
      </SidebarHeader>
      <SidebarContent className="pl-2">
        {/* Overview */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="mb-2">
              <CollapsibleTrigger>
                <NavLink className={({ isActive }) => 
                `text-[24px] font-semibold text-black ${
                isActive ? 
                "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#ff004f] rounded-[12px] items-center justify-start pl-4 pt-1"
                 : 
                ""}`}
                 to="/">Overview</NavLink> {/*Need the logic for id*/}
                <ChevronDown
                  className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                  style={{ position: "relative" }}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {OverviewItems.map((overviewItem) => (
                    <SidebarMenuItem key={overviewItem.title} className={styles.secondaryItem}>
                      <SidebarMenuButton asChild>
                        <span>{overviewItem.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Destination */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
              <SidebarMenuButton>
              <NavLink className={({ isActive }) => 
                `text-[24px] font-semibold text-black ${
                isActive ? 
                "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#ff004f] rounded-[12px] items-center justify-start pl-4 pt-1"
                 : 
                ""}`}
                to="#">Destinations</NavLink> {/*Link for Destinations*/}
              </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Itinerary */}
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="mb-2">
              <CollapsibleTrigger>
                <NavLink className={({ isActive }) => 
                `text-[24px] font-semibold text-black ${
                isActive ? 
                "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#ff004f] rounded-[12px] items-center justify-start pl-4 pt-1"
                 : 
                ""}`}
                to="/itineraryWL">Itinerary</NavLink>

                <ChevronDown
                  className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                  style={{ position: "relative" }}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ItineraryItems.map((itineraryItem) => (
                    <SidebarMenuItem key={itineraryItem.title} className={styles.secondaryItem}>
                      <SidebarMenuButton asChild>
                        <span>{itineraryItem.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Budget */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
              <SidebarMenuButton>
                <NavLink className={({ isActive }) => 
                `text-[24px] font-semibold text-black ${
                isActive ? 
                "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#ff004f] rounded-[12px] items-center justify-start pl-4 pt-1"
                 : 
                ""}`}
                to="/expense-splitting">Budget</NavLink> {/*Link for Budget*/}
              </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Wishlist */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
              <SidebarMenuButton>
                <NavLink className={({ isActive }) => 
                `text-[24px] font-semibold text-black ${
                isActive ? 
                "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#ff004f] rounded-[12px] items-center justify-start pl-4 pt-1"
                 : 
                ""}`}
                to="/wishlist">Wishlist</NavLink> {/*Link for Wishlist*/}
              </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
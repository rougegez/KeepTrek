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
    <Sidebar collapsible="none" className="h-screen bg-white">
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
                <a className={styles.primaryItem} href="/trip-details/Ntei46ZcDkpqezzCjrH1">Overview</a> {/*Need to add logic for ID and
                make it not reload the page when already on it*/}
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {OverviewItems.map((item) => (
                    <SidebarMenuItem key={item.title} className={styles.secondaryItem}>
                      <SidebarMenuButton asChild>
                        <span>{item.title}</span>
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
                <a className={styles.primaryItem} href="#">Destinations</a> {/*Link for Destinations*/}
              </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Itinerary */}
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="mb-2">
              <CollapsibleTrigger>
                <a className={styles.primaryItem} href="/itinerary">Itinerary</a>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ItineraryItems.map((item) => (
                    <SidebarMenuItem key={item.title} className={styles.secondaryItem}>
                      <SidebarMenuButton asChild>
                        <span>{item.title}</span>
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
                <a className={styles.primaryItem} href="#">Budget</a> {/*Link for Budget*/}
              </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Wishlist */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
              <SidebarMenuButton>
                <a className={styles.primaryItem} href="#">Wishlist</a> {/*Link for Wishlist*/}
              </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
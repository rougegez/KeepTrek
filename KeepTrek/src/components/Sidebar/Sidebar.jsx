import styles from './Sidebar.module.css';
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
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
}
from "@/components/ui/collapsible";

import { NavLink } from 'react-router-dom';

// Example of Overview items
const OverviewItems = [
  { title: "Trip Summary", url: "" },
  { title: "Accommodation", url: "" },
  { title: "Trip Buddy", url: "" },
  { title: "Notes", url: "" },
  { title: "Attachments", url: "" },
];

export const AppSidebar = ({ tripID }) => {
  return (
    <Sidebar className="h-screen w-11/12 sticky top-0 bg-white drop-shadow-keepTrek overflow-y-auto z-50">
      <SidebarTrigger />
      <SidebarHeader>
        <a href="/">
          <img
            src="../src/assets/KeepTrekNew.png"
            alt="KeepTrek Logo"
            className="size-18 w-44 mt-4"
          />
        </a>
      </SidebarHeader>
      <SidebarContent className="pl-2 mt-14">
        {/* Overview */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="mb-2">
              <CollapsibleTrigger>
                <NavLink
                  to={`/overview/${tripID}`}
                  className={({ isActive }) =>
                    `text-[24px] font-semibold text-black ${
                      isActive
                        ? "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#4DB6AC] rounded-[12px] items-center justify-start pl-4 pt-1 text-white"
                        : ""
                    }`
                  }
                >
                  Overview
                </NavLink>
                <ChevronDown
                  className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                  style={{ position: "relative" }}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {OverviewItems.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      className={styles.secondaryItem}
                    >
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

        {/* Itinerary */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
            <SidebarMenuButton>
              <NavLink
                to={`/itineraryWL/${tripID}`}
                className={({ isActive }) =>
                  `text-[24px] font-semibold text-black ${
                    isActive
                      ? "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#4DB6AC] rounded-[12px] items-center justify-start pl-4 pt-1 text-white"
                      : ""
                  }`
                }
              >
                Itinerary
              </NavLink>
            </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Budget */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
            <SidebarMenuButton>
              <NavLink
                to={`/expenses/${tripID}`}
                className={({ isActive }) =>
                  `text-[24px] font-semibold text-black ${
                    isActive
                      ? "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#4DB6AC] rounded-[12px] items-center justify-start pl-4 pt-1 text-white"
                      : ""
                  }`
                }
              >
                Budget
              </NavLink>
            </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Wishlist */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
            <SidebarMenuButton>
              <NavLink
                to={`/wishlist/${tripID}`}
                className={({ isActive }) =>
                  `text-[24px] font-semibold text-black ${
                    isActive
                      ? "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#4DB6AC] rounded-[12px] items-center justify-start pl-4 pt-1 text-white"
                      : ""
                  }`
                }
              >
                Wishlist
              </NavLink>
            </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Date Finder */}
        <SidebarGroup>
          <SidebarGroupLabel asChild className="mb-2">
            <SidebarMenuButton>
              <NavLink
                to={`/schedule/${tripID}`}
                className={({ isActive }) =>
                  `text-[24px] font-semibold text-black ${
                    isActive
                      ? "absolute flex left-2 w-[calc(100%-1rem)] h-[2.5rem] bg-[#4DB6AC] rounded-[12px] items-center justify-start pl-4 pt-1 text-white"
                      : ""
                  }`
                }
              >
                Can't Find a Date?
              </NavLink>
            </SidebarMenuButton>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
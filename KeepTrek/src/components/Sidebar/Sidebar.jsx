import { useState } from 'react';
import styles from './Sidebar.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Menu, Home, Hotel, Users, FileText, Paperclip, Calendar, PiggyBank, Heart, CalendarClock, Map, X, ShoppingBag } from 'lucide-react';
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from 'react-query';
import { getTrip } from '@/APIs/trip.js';


// Overview items with icons
const OverviewItems = [
  { title: "Trip Summary", icon: Home, url: "" },
  { title: "Accommodation", icon: Hotel, url: "" },
  { title: "Trip Buddy", icon: Users, url: "" },
  { title: "Notes", icon: FileText, url: "" },
  { title: "Attachments", icon: Paperclip, url: "" },
];

export const AppSidebar = ({ tripID }) => {
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  const { data: tripDetails } = useQuery(
    ["trip", tripID],
    () => getTrip(tripID),
    {
      // Basic suspense and stale time for this shared component
      suspense: false, 
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const displayLocation =
  tripDetails?.location?.toLowerCase() === "langkawi"
    ? "Langkawi Island"
    : tripDetails?.location;

  const sidebarClassName = cn(
    "h-screen bg-white drop-shadow-keepTrek overflow-y-auto z-50 transition-all duration-300",
    isCollapsed ? "w-16" : "w-60", // Adjust width when collapsed or expanded
    "fixed md:flex"
  );
  return (
    <>
      
      <Sidebar className={sidebarClassName}>
      <SidebarHeader className={styles.sidebarHeader}>
        <motion.div
          initial={false}
          animate={{ width: "auto" }}
          className="overflow-hidden"
        >
          <a href="/" className="">
            <img
              src="/assets/navbarlogo.png"
              alt="KeepTrek Logo"
              className="h-12"
            />
          </a>
        </motion.div>
        
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Overview Section */}
        {/* <Collapsible defaultClosed className="group/collapsible">
          <SidebarGroup>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarGroupLabel asChild className="mb-2">
                <CollapsibleTrigger className="w-full">
                  <NavLink
                    to={`/trip-details`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center text-lg font-semibold text-gray-900 rounded-md p-2",
                        isActive && styles.activeLink
                      )
                    }
                  >
                    <Map className={styles.icon} />
                    Overview
                  </NavLink>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
            </motion.div>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {OverviewItems.map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SidebarMenuItem className={styles.secondaryItem}>
                        <SidebarMenuButton asChild>
                          <span className="flex items-center">
                            <item.icon className={styles.icon} />
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible> */}

        {/* Main Navigation Items */}
        {[ 
          { title: "Itinerary", icon: Calendar, path: `/itinerary/${tripID}` },
          { title: "Expenses", icon: PiggyBank, path: `/expenses/${tripID}` },
          { title: "Suggest", icon: Heart, path: `/wishlist/${tripID}` },
          { title: "Can't Find a Date?", icon: CalendarClock, path: `/schedule/${tripID}` },
          { title: "Browse Activities", icon: ShoppingBag, path: `/browse-activities/${tripID}` },
        ].map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <SidebarGroup className="mb-2">
              <SidebarGroupLabel asChild>
                <SidebarMenuButton>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center text-lg font-semibold text-gray-900 rounded-md p-2",
                        isActive && styles.activeLink
                      )
                    }
                  >
                    <item.icon className={styles.icon} />
                    {item.title}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarGroupLabel>
            </SidebarGroup>
          </motion.div>
        ))}
      </SidebarContent>

      
    </Sidebar>
    </>
  )
};

export default AppSidebar;

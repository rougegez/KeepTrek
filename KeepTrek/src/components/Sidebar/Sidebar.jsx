import { useState } from 'react'
import styles from './Sidebar.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { ChevronDown, Menu, Home, Hotel, Users, FileText, Paperclip, Calendar, PiggyBank, Heart, CalendarClock, Map, X } from 'lucide-react'
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
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Overview items with icons
// const OverviewItems = [
//   { title: "Trip Summary", icon: Home, url: "" },
//   { title: "Accommodation", icon: Hotel, url: "" },
//   { title: "Trip Buddy", icon: Users, url: "" },
//   { title: "Notes", icon: FileText, url: "" },
//   { title: "Attachments", icon: Paperclip, url: "" },
// ]

export const AppSidebar = ({ tripID }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const sidebarContent = (
    <Sidebar
      className={cn(
        "h-screen bg-white drop-shadow-keepTrek overflow-y-auto z-50 transition-all duration-300",
        isOpen ? "w-60" : "w-20",
        "fixed md:flex"
      )}
    >
      <SidebarHeader className={styles.sidebarHeader}>
        <motion.div
          initial={false}
          animate={{ width: isOpen ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <a href="/">
            <img
              src="../src/assets/KeepTrekNew.png"
              alt="KeepTrek Logo"
              className="h-12"
            />
          </a>
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileSidebar}
        >
          <X className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {/* Overview Section */}
        <Collapsible defaultClosed className="group/collapsible mt-4">
          <SidebarGroup>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarGroupLabel asChild className="mb-2">
                <CollapsibleTrigger className="w-full">
                  <NavLink
                    to={`/overview/${tripID}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center text-lg font-semibold text-gray-900 rounded-md p-2",
                        isActive && styles.activeLink
                      )
                    }
                  >
                    <Map className={styles.icon} />
                    {isOpen && "Overview"}
                  </NavLink>
                  {isOpen && (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
            </motion.div>

            {/* <CollapsibleContent>
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
                            {isOpen && item.title}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent> */}
          </SidebarGroup>
        </Collapsible>

        {/* Main Navigation Items */}
        {[
          { title: "Itinerary", icon: Calendar, path: `/itineraryWL/${tripID}` },
          { title: "Budget", icon: PiggyBank, path: `/expenses/${tripID}` },
          { title: "Wishlist", icon: Heart, path: `/wishlist/${tripID}` },
          {
            title: "Can't Find a Date?",
            icon: CalendarClock,
            path: `/schedule/${tripID}`
          },
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
                        "flex items-center text-lg font-semibold text-gray-900 p-2",
                        isActive && styles.activeLink
                      )
                    }
                  >
                    <item.icon className={styles.icon} />
                    {isOpen && item.title}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarGroupLabel>
            </SidebarGroup>
          </motion.div>
        ))}
      </SidebarContent>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 hidden md:flex"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </Sidebar>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={toggleMobileSidebar}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSidebar;

import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const MobileHeader = ({ title }) => (
  <div className="fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 flex items-center px-1">
    <Button variant="ghost" size="icon" className="mr-2" asChild>
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
    </Button>
    <h2 className="font-semibold">{title}</h2>
  </div>
);

export default MobileHeader;

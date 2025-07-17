import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

function InfoTip({ 
    children, 
    iconProps,
    tooltipProps
}) {
  return (
      <Tooltip {...tooltipProps?.root}>
        <TooltipTrigger asChild>
          <Info {...iconProps} className={cn("ml-1 h-3 w-3", iconProps?.className)} />
        </TooltipTrigger>
        <TooltipContent side="right" {...tooltipProps?.content}>
          {children}
        </TooltipContent>
      </Tooltip>
  );
}

export default InfoTip;
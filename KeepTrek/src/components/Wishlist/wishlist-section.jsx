import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
  import { ChevronRight } from 'lucide-react'
  
  export default function WishlistSection({ title, children }) {
    return (
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center gap-2 py-2 group">
          <h2 className="text-xl font-semibold">{title}</h2>
          <ChevronRight className="h-5 w-5 transition-transform group-data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }
  
  
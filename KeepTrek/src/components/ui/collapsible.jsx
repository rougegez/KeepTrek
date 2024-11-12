// Has been modified to default to ease in/out
'use client';

import { cn } from '@/lib/utils';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as React from 'react';

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef((props, ref) => {
    const { className, ...otherProps } = props;
    
    return (
        <CollapsiblePrimitive.CollapsibleContent
            ref={ref}
            className={cn('overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up', className)}
            {...otherProps}
        />
    );
});

CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
import React, { Suspense } from "react";
import { PageLoader } from "@/components/ui/pageLoader";

const withSuspense = (
    Component,
    fallback = <PageLoader/>
) => (props) => {
    return (
        <Suspense fallback={fallback}>
            <Component {...props} />
        </Suspense>
    );
};

export { withSuspense };
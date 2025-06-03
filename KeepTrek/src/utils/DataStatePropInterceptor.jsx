import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

export const DataStatePropInterceptor = forwardRef((props, ref) => {
  const { "data-state": dataState, children, ...rest } = props;
  if (dataState) {
    return (
      <span data-state={dataState}>
        <Slot {...rest} ref={ref}>
          {children}
        </Slot>
      </span>
    );
  }
  return (
    <Slot {...rest} ref={ref}>
      {children}
    </Slot>
  );
});

DataStatePropInterceptor.displayName = "DataStatePropInterceptor";

export default DataStatePropInterceptor;
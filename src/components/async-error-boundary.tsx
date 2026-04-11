"use client";

import { ReactNode } from "react";
import { unstable_catchError, type ErrorInfo } from "next/error";

import {
  InlineErrorState,
  RetryButton,
  SectionErrorCard,
  SidebarErrorState,
} from "@/components/async-states";

type AsyncErrorBoundaryProps = {
  title: string;
  description: string;
  variant?: "card" | "inline" | "sidebar";
  retryLabel?: string;
  className?: string;
  children: ReactNode;
};

const AsyncErrorBoundary = unstable_catchError(
  (
    {
      title,
      description,
      variant = "card",
      retryLabel = "Try again",
      className,
    }: Omit<AsyncErrorBoundaryProps, "children">,
    { unstable_retry }: ErrorInfo,
  ) => {
    const action = (
      <RetryButton onClick={() => unstable_retry()}>{retryLabel}</RetryButton>
    );

    if (variant === "inline") {
      return (
        <InlineErrorState
          title={title}
          description={description}
          action={action}
          className={className}
        />
      );
    }

    if (variant === "sidebar") {
      return (
        <SidebarErrorState
          title={title}
          description={description}
          action={action}
          className={className}
        />
      );
    }

    return (
      <SectionErrorCard
        title={title}
        description={description}
        action={action}
        className={className}
      />
    );
  },
);

export { AsyncErrorBoundary };

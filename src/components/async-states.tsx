import { ReactNode } from "react";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  RotateCcwIcon,
  SearchXIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarFooter } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export const SectionErrorCard = ({
  title,
  description,
  action,
  className,
}: ErrorStateProps) => {
  return (
    <Card
      className={cn(
        "border-destructive/30 bg-destructive/5 shadow-none",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-4 py-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive">
            <AlertTriangleIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-destructive">{title}</CardTitle>
            <CardDescription className="text-destructive/80">
              {description}
            </CardDescription>
          </div>
        </div>
        {action}
      </CardContent>
    </Card>
  );
};

export const InlineErrorState = ({
  title,
  description,
  action,
  className,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/15">
          <AlertTriangleIcon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-destructive/80">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const SidebarErrorState = ({
  title,
  description,
  action,
  className,
}: ErrorStateProps) => {
  return (
    <SidebarFooter className={className}>
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/15">
            <AlertTriangleIcon className="size-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-destructive/80">{description}</p>
          </div>
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </SidebarFooter>
  );
};

export const RetryButton = ({
  children = "Try again",
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      variant="destructive"
      size="sm"
      className={cn("w-fit", className)}
      {...props}
    >
      <RotateCcwIcon />
      {children}
    </Button>
  );
};

export const HeaderActionsSkeleton = () => {
  return <Skeleton className="h-9 w-28 rounded-md" />;
};

export const SidebarUserSkeleton = () => {
  return (
    <SidebarFooter>
      <div className="flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </SidebarFooter>
  );
};

export const AppSidebarSkeleton = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
          </div>
          <Skeleton className="size-8 rounded-md" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {Array.from({ length: 3 }).map((_, index) => (
            <SidebarMenuSkeleton key={index} showIcon />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarUserSkeleton />
      <SidebarRail />
    </Sidebar>
  );
};

export const HomeFiltersSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Skeleton className="h-20 w-full max-w-3xl rounded-full" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-28 rounded-full" />
        ))}
      </div>
    </div>
  );
};

const MathProblemCardSkeleton = () => {
  return (
    <Card className="h-full shadow-none">
      <CardContent className="flex h-full flex-col gap-4 py-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="mt-auto h-9 w-full rounded-md" />
      </CardContent>
    </Card>
  );
};

export const MathProblemsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="space-y-6 w-full max-w-300 mx-auto">
      <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <MathProblemCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const HomeMathProblemsEmptyState = ({
  hasActiveFilters,
}: {
  hasActiveFilters: boolean;
}) => {
  return (
    <Card className="mx-auto w-full max-w-3xl border-2 border-dashed shadow-none">
      <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {hasActiveFilters ? (
            <SearchXIcon className="size-8" />
          ) : (
            <BookOpenIcon className="size-8" />
          )}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">
            {hasActiveFilters
              ? "No problems match your filters"
              : "No problems have been published yet"}
          </CardTitle>
          <CardDescription className="mx-auto max-w-xl text-base">
            {hasActiveFilters
              ? "Try clearing a few filters or broadening your search to uncover more problems."
              : "The collection is still warming up. Check back soon for new commutative algebra problems to explore."}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

const CommentSkeleton = () => {
  return (
    <div className="w-full border-b border-dashed p-4">
      <div className="flex min-w-0 items-start gap-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProblemDetailSkeleton = () => {
  return (
    <div className="w-full px-6 py-10">
      <Card className="mx-auto w-full max-w-5xl shadow-none ring-1 ring-border">
        <CardContent className="flex flex-col gap-6 py-6">
          <Button variant="ghost" className="w-fit" disabled>
            <ArrowLeftIcon />
            Back to Home
          </Button>

          <div className="space-y-3">
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-10 w-3/5" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="space-y-3 py-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className={cn("h-4", index === 5 ? "w-2/3" : "w-full")}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-10 w-44 rounded-full" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            <Card className="border-border border-dashed shadow-none">
              <CardContent className="p-0">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CommentSkeleton key={index} />
                ))}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-52 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminTableSkeleton = ({
  columns = 6,
  rows = 6,
}: {
  columns?: number;
  rows?: number;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Skeleton className="h-10 w-full max-w-100 rounded-md" />
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
        <Skeleton className="ml-auto h-10 w-24 rounded-md" />
      </div>

      <div className="rounded-md border">
        <div className="w-full overflow-x-auto overscroll-x-contain">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: columns }).map((_, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: columns }).map((_, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <Skeleton
                          className={cn(
                            "h-5",
                            columnIndex === 0 ? "w-5" : "w-full max-w-40",
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
};

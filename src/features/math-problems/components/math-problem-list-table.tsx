"use client";

import { ColumnDef, Table } from "@tanstack/react-table";
import {
  GetUserMathProblemsType,
  updateMathProblemStatus,
} from "../actions/actions";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortableColumnHeader } from "@/components/data-table/data-table-sortable-column-header";
import { Button } from "@/components/ui/button";
import {
  ArchiveIcon,
  EditIcon,
  EllipsisVerticalIcon,
  FileEditIcon,
  GlobeIcon,
  MessageSquareIcon,
  SearchIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MathProblemStatus, mathProblemStatuses } from "@/db/schema";
import { formatNumberTruncate } from "@/lib/utils";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

export const getMathProblemStatus = (status: MathProblemStatus) => {
  switch (status) {
    case "draft":
      return (
        <>
          <FileEditIcon className="size-4" />
          Draft
        </>
      );
    case "published":
      return (
        <>
          <GlobeIcon className="size-4" />
          Published
        </>
      );
    case "archived":
      return (
        <>
          <ArchiveIcon className="size-4" />
          Archived
        </>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
};

const columns: ColumnDef<GetUserMathProblemsType[number]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    accessorFn: (row) => row.title,
    header: "Title",
    cell: ({ row }) => {
      return (
        <div
          className="max-w-[12rem] lg:max-w-xl truncate text-lg font-medium"
          title={row.original.title}
        >
          {row.original.title}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StatusCell id={row.original.id} originalStatus={row.original.status} />
      );
    },
  },
  {
    accessorKey: "commentCount",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Comment Count" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-4" />
        <span>{formatNumberTruncate(row.original.commentCount)}</span>
      </div>
    ),
  },
  {
    accessorKey: "upVoteCount",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Upvote Count" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ThumbsUpIcon className="size-4" />
        <span>{formatNumberTruncate(row.original.upVoteCount)}</span>
      </div>
    ),
  },
  {
    accessorKey: "downVoteCount",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Downvote Count" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ThumbsDownIcon className="size-4" />
        <span>{formatNumberTruncate(row.original.downVoteCount)}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Created At" column={column} />
    ),
    cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <EditIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2Icon className="text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];

const Toolbar = <T,>({ table }: { table: Table<T> }) => {
  const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount();
  const selectedRows = table.getSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative w-full max-w-100">
        <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center px-3">
          <SearchIcon className="size-4" />
        </div>

        <Input
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          placeholder="Search math problems by title..."
          className="pl-9 flex-1"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 mt-2 md:mt-0 flex-1">
        {hiddenRows > 0 && (
          <div className="text-sm text-muted-foreground sm:ml-2">
            {hiddenRows} {hiddenRows > 1 ? "rows" : "row"} hidden
          </div>
        )}

        {selectedRows > 0 && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground sm:ml-2">
              {selectedRows} {selectedRows > 1 ? "rows" : "row"} selected
            </div>
            <Button variant="outline">
              <EditIcon />
              Set Status
            </Button>
            <Button variant="destructive">
              <Trash2Icon />
              Delete {selectedRows} {selectedRows > 1 ? "rows" : "row"}
            </Button>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const MathProblemListTable = ({
  mathProblems,
}: {
  mathProblems: GetUserMathProblemsType;
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <DataTable
        data={mathProblems}
        columns={columns}
        noResultsMessage="No math problems found."
        ToolbarComponent={Toolbar}
        tableClassName="min-w-[72rem]"
      />
    </div>
  );
};

const StatusCell = ({
  id,
  originalStatus,
}: {
  id: string;
  originalStatus: MathProblemStatus;
}) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(originalStatus);
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button variant="ghost">
          {getMathProblemStatus(optimisticStatus)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {mathProblemStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => {
              startTransition(async () => {
                setOptimisticStatus(status);
                const res = await updateMathProblemStatus(id, status);

                if (res.error) {
                  toast.error(res.message);
                }
              });
            }}
          >
            {getMathProblemStatus(status)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

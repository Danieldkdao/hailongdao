"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableSortableColumnHeader } from "@/components/data-table/data-table-sortable-column-header";
import { DifficultyStars } from "@/components/difficulty-stars";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MathProblemDifficultyLevel,
  mathProblemDifficultyLevels,
  MathProblemStatus,
  mathProblemStatuses,
} from "@/db/schema";
import { useConfirm } from "@/hooks/use-confirm";
import { formatDate, formatNumberTruncate } from "@/lib/utils";
import { ColumnDef, Table } from "@tanstack/react-table";
import {
  ArchiveIcon,
  DumbbellIcon,
  EditIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FileEditIcon,
  GlobeIcon,
  MessageSquareIcon,
  SearchIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteMathProblems,
  GetUserMathProblemsType,
  updateMathProblemsDifficultyLevel,
  updateMathProblemsStatus,
} from "../actions/actions";
import { UpdateMathProblemDialog } from "./update-math-problem-dialog";

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
    accessorKey: "difficultyLevel",
    header: "Difficulty Level",
    cell: ({ row }) => {
      return (
        <DifficultyLevelCell
          id={row.original.id}
          originalDifficultyLevel={row.original.difficultyLevel}
        />
      );
    },
  },
  {
    accessorKey: "views",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="View Count" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <EyeIcon className="size-4" />
        <span>{formatNumberTruncate(row.original.views)}</span>
      </div>
    ),
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
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell mathProblem={row.original} />;
    },
    enableHiding: false,
  },
];

const Toolbar = <T,>({ table }: { table: Table<T> }) => {
  const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount();

  return (
    <div className="flex flex-col gap-2">
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
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={mathProblemStatuses.map((status) => ({
              label: (
                <div className="flex items-center gap-2">
                  {getMathProblemStatus(status)}
                </div>
              ),
              value: status,
              key: status,
            }))}
          />
        )}
        {table.getColumn("difficultyLevel") && (
          <DataTableFacetedFilter
            column={table.getColumn("difficultyLevel")}
            title="Difficulty Level"
            options={mathProblemDifficultyLevels.map((level) => ({
              label: <DifficultyStars difficultyLevel={level} />,
              value: level,
              key: level,
            }))}
          />
        )}
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 mt-2 md:mt-0 flex-1">
        {hiddenRows > 0 && (
          <div className="text-sm text-muted-foreground sm:ml-2">
            {hiddenRows} {hiddenRows > 1 ? "rows" : "row"} hidden
          </div>
        )}

        {table.getSelectedRowModel().rows.length > 0 && (
          <SelectedRowActions
            table={table as Table<GetUserMathProblemsType[number]>}
          />
        )}
      </div>
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
        getRowId={(row) => row.id}
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
                const res = await updateMathProblemsStatus([id], status);

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

const DifficultyLevelCell = ({
  id,
  originalDifficultyLevel,
}: {
  id: string;
  originalDifficultyLevel: MathProblemDifficultyLevel;
}) => {
  const [optimisticDifficultyLevel, setOptimisticDifficultyLevel] =
    useOptimistic(originalDifficultyLevel);
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button variant="ghost">
          <DifficultyStars difficultyLevel={optimisticDifficultyLevel} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {mathProblemDifficultyLevels.map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() => {
              startTransition(async () => {
                setOptimisticDifficultyLevel(level);
                const res = await updateMathProblemsDifficultyLevel(
                  [id],
                  level,
                );

                if (res.error) {
                  toast.error(res.message);
                }
              });
            }}
          >
            <DifficultyStars difficultyLevel={level} className="size-4" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ActionCell = ({
  mathProblem,
}: {
  mathProblem: GetUserMathProblemsType[number];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete this math problem? This will cause a permanent loss of data and cannot be undone.",
  );
  const deleteAction = async () => {
    setIsLoading(true);
    const confirmation = await confirm();
    if (!confirmation) return;
    const response = await deleteMathProblems([mathProblem.id]);

    if (response.error) {
      setIsLoading(false);
      toast.error(response.message);
      return;
    }
    setIsLoading(false);
    toast.success(response.message);
    router.refresh();
  };

  return (
    <>
      <UpdateMathProblemDialog
        open={open}
        setOpen={setOpen}
        data={mathProblem}
      />
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            asChild
            disabled={mathProblem.status !== "published"}
          >
            <Link
              href={`/problems/${mathProblem.id}`}
              target="_blank"
              rel="noopener"
            >
              <EyeIcon />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={deleteAction}>
            <Trash2Icon className="text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const SelectedRowActions = ({
  table,
}: {
  table: Table<GetUserMathProblemsType[number]>;
}) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRowsLength = selectedRows.length;
  const router = useRouter();
  const [confirmationText, setConfirmationText] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    confirmationText.title,
    confirmationText.description,
  );

  const deleteManyAction = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setConfirmationText({
      title: "Confirm Multiple Problem Deletion",
      description: `Are you sure you want to delete ${selectedRowsLength} math ${selectedRowsLength > 1 ? "problems" : "problem"}? This action will cause a permanent loss of data and cannot be undone.`,
    });
    const confirmation = await confirm();
    if (!confirmation) return;
    const response = await deleteMathProblems(
      selectedRows.map((row) => row.original.id),
    );
    if (response.error) {
      toast.error(response.message);
      setIsLoading(false);
      return;
    }
    toast.success(response.message);
    setIsLoading(false);
    table.resetRowSelection();
    router.refresh();
  };

  const updateStatusAction = async (status: MathProblemStatus) => {
    if (isLoading) return;
    setIsLoading(true);
    setConfirmationText({
      title: "Confirm Multiple Problem Update",
      description: `Are you sure you want to update ${selectedRowsLength} math ${selectedRowsLength > 1 ? "problems" : "problem"} to have a status of ${status}?`,
    });
    const confirmation = await confirm();
    if (!confirmation) return;
    const response = await updateMathProblemsStatus(
      selectedRows.map((row) => row.original.id),
      status,
    );
    if (response.error) {
      toast.error(response.message);
      setIsLoading(false);
      return;
    }
    toast.success(response.message);
    setIsLoading(false);
    table.resetRowSelection();
    router.refresh();
  };

  const updateDifficultyLevelAction = async (
    difficultyLevel: MathProblemDifficultyLevel,
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setConfirmationText({
      title: "Confirm Multiple Problem Update",
      description: `Are you sure you want to update ${selectedRowsLength} math ${selectedRowsLength > 1 ? "problems" : "problem"} to have a difficulty level of ${difficultyLevel}?`,
    });
    const confirmation = await confirm();
    if (!confirmation) return;
    const response = await updateMathProblemsDifficultyLevel(
      selectedRows.map((row) => row.original.id),
      difficultyLevel,
    );
    if (response.error) {
      toast.error(response.message);
      setIsLoading(false);
      return;
    }
    toast.success(response.message);
    setIsLoading(false);
    table.resetRowSelection();
    router.refresh();
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground sm:ml-2">
          {selectedRowsLength} {selectedRowsLength > 1 ? "rows" : "row"}{" "}
          selected
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button variant="outline">
              <EditIcon />
              Set Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {mathProblemStatuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => updateStatusAction(status)}
              >
                {getMathProblemStatus(status)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <Button variant="outline">
              <DumbbellIcon />
              Set Difficulty Level
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {mathProblemDifficultyLevels.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => updateDifficultyLevelAction(level)}
              >
                <DifficultyStars difficultyLevel={level} className="size-4" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="destructive"
          onClick={deleteManyAction}
          disabled={isLoading}
        >
          <Trash2Icon />
          Delete {selectedRowsLength} {selectedRowsLength > 1 ? "rows" : "row"}
        </Button>
      </div>
    </>
  );
};

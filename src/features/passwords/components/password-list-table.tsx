"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortableColumnHeader } from "@/components/data-table/data-table-sortable-column-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/hooks/use-confirm";
import { formatDate } from "@/lib/utils";
import { EditIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import type { ColumnDef, Table } from "@tanstack/react-table";
import {
  deletePasswordAction,
  type getPasswordsAction,
  updatePasswordEnabledAction,
} from "../actions/actions";
import { PasswordDialog } from "./password-dialog";

type Passwords = Awaited<ReturnType<typeof getPasswordsAction>>;
type PasswordRow = Passwords[number];

const columns: ColumnDef<PasswordRow>[] = [
  {
    id: "search",
    accessorFn: (row) =>
      `${row.password} ${row.user.name} ${row.user.email}`.toLowerCase(),
    enableSorting: false,
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Password" column={column} />
    ),
    cell: ({ row }) => (
      <span className="block max-w-2xs truncate font-mono text-sm">
        {row.original.password}
      </span>
    ),
  },
  {
    accessorKey: "enabled",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Enabled" column={column} />
    ),
    cell: ({ row }) => <EnabledCell password={row.original} />,
  },
  {
    id: "createdBy",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Created By" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{row.original.user.name}</span>
        <span className="truncate text-sm text-muted-foreground">
          {row.original.user.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Created At" column={column} />
    ),
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Updated At" column={column} />
    ),
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell password={row.original} />,
    enableHiding: false,
    enableSorting: false,
  },
];

const Toolbar = ({ table }: { table: Table<PasswordRow> }) => {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground">
        <SearchIcon className="size-4" />
      </div>
      <Input
        value={(table.getColumn("search")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table
            .getColumn("search")
            ?.setFilterValue(event.target.value.toLowerCase())
        }
        placeholder="Search password, name, or email..."
        className="pl-9"
      />
    </div>
  );
};

export const PasswordListTable = ({ passwords }: { passwords: Passwords }) => {
  return (
    <div className="w-full overflow-x-auto">
      <DataTable
        data={passwords}
        columns={columns}
        noResultsMessage="No passwords found."
        ToolbarComponent={Toolbar}
        tableClassName="min-w-[60rem]"
        initialColumnVisibility={{ search: false }}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

const ActionCell = ({ password }: { password: PasswordRow }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Password",
    "Are you sure you want to delete this password? This action cannot be undone.",
    "destructive",
  );

  const deletePassword = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;

    startTransition(async () => {
      const response = await deletePasswordAction(password.id);

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    });
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="flex items-center justify-end gap-2">
        <PasswordDialog existingPassword={password}>
          <Button variant="outline" size="icon" aria-label="Update password">
            <EditIcon />
          </Button>
        </PasswordDialog>
        <Button
          variant="destructive"
          size="icon"
          disabled={isPending}
          onClick={deletePassword}
          aria-label="Delete password"
        >
          <Trash2Icon />
        </Button>
      </div>
    </>
  );
};

const EnabledCell = ({ password }: { password: PasswordRow }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(
    password.enabled,
  );

  const updateEnabled = (enabled: boolean) => {
    startTransition(async () => {
      setOptimisticEnabled(enabled);

      const response = await updatePasswordEnabledAction(password.id, enabled);

      if (response.error) {
        toast.error(response.message);
        router.refresh();
        return;
      }

      toast.success(response.message);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={optimisticEnabled}
        disabled={isPending}
        onCheckedChange={updateEnabled}
        aria-label={`${optimisticEnabled ? "Disable" : "Enable"} password`}
        className="cursor-pointer"
      />
      <span className="text-sm text-muted-foreground">
        {optimisticEnabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
};

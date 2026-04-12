"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableSortableColumnHeader } from "@/components/data-table/data-table-sortable-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { formatDate, formatNumberTruncate } from "@/lib/utils";
import { UserAvatar } from "@/features/user/components/user-avatar";
import {
  banUsers,
  deleteUsers,
  GetUsersType,
  revokeUsersSessions,
  updateUsersEmailVerification,
  updateUsersRole,
  UserBanDuration,
  unbanUsers,
} from "../actions/action";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  BadgeCheckIcon,
  BanIcon,
  CircleCheckIcon,
  EllipsisVerticalIcon,
  MailCheckIcon,
  MailXIcon,
  MessageSquareIcon,
  RefreshCcwIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldIcon,
  Trash2Icon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type UserRow = GetUsersType[number];
type UserRoleFilter = UserRow["role"];
type UserAccessFilter = "active" | "banned";
type UserVerificationFilter = "verified" | "unverified";
type UserSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "username-asc"
  | "email-asc";

const BAN_OPTIONS: {
  key: UserBanDuration;
  label: string;
  description: string;
}[] = [
  {
    key: "day",
    label: "Ban for 24 hours",
    description: "This user will lose access for the next day.",
  },
  {
    key: "week",
    label: "Ban for 7 days",
    description: "This user will lose access for the next week.",
  },
  {
    key: "permanent",
    label: "Ban permanently",
    description: "This user will stay banned until an admin unbans them.",
  },
];

const SORT_OPTIONS: {
  label: string;
  value: UserSortOption;
}[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Name A-Z", value: "name-asc" },
  { label: "Username A-Z", value: "username-asc" },
  { label: "Email A-Z", value: "email-asc" },
];

const getSortValue = (table: Table<UserRow>): UserSortOption => {
  const [sort] = table.getState().sorting;

  if (!sort) return "newest";
  if (sort.id === "createdAt" && sort.desc) return "newest";
  if (sort.id === "createdAt" && !sort.desc) return "oldest";
  if (sort.id === "name" && !sort.desc) return "name-asc";
  if (sort.id === "username" && !sort.desc) return "username-asc";
  if (sort.id === "email" && !sort.desc) return "email-asc";

  return "newest";
};

const setTableSort = (table: Table<UserRow>, value: UserSortOption) => {
  switch (value) {
    case "newest":
      table.setSorting([{ id: "createdAt", desc: true }]);
      return;
    case "oldest":
      table.setSorting([{ id: "createdAt", desc: false }]);
      return;
    case "name-asc":
      table.setSorting([{ id: "name", desc: false }]);
      return;
    case "username-asc":
      table.setSorting([{ id: "username", desc: false }]);
      return;
    case "email-asc":
      table.setSorting([{ id: "email", desc: false }]);
      return;
  }
};

const matchesMultiValueFilter = <TValue,>(
  row: Row<UserRow>,
  columnId: string,
  filterValues: TValue[],
) => {
  if (!Array.isArray(filterValues) || filterValues.length === 0) return true;

  return filterValues.includes(row.getValue(columnId));
};

const getColumns = (currentUserId: string): ColumnDef<UserRow>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="User" column={column} />
    ),
    filterFn: (row, _, value: string) => {
      const query = value.trim().toLowerCase();
      if (!query) return true;

      const searchValues = [
        row.original.name,
        row.original.email,
        row.original.username,
        row.original.displayUsername,
      ]
        .filter(Boolean)
        .map((field) => field?.toLowerCase() ?? "");

      return searchValues.some((field) => field.includes(query));
    },
    cell: ({ row }) => {
      return (
        <div className="flex min-w-3xs items-center gap-3">
          <UserAvatar
            name={row.original.name}
            image={row.original.image}
            className="size-10"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{row.original.name}</p>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "username",
    accessorFn: (row) => row.displayUsername ?? row.username ?? "",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Username" column={column} />
    ),
    cell: ({ row }) => {
      const username = row.original.displayUsername ?? row.original.username;

      return (
        <div className="text-sm font-medium">
          {username ? `@${username}` : "No username"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Role" column={column} />
    ),
    filterFn: (row, columnId, value: UserRoleFilter[]) =>
      matchesMultiValueFilter(row, columnId, value),
    cell: ({ row }) => (
      <RoleCell
        key={`${row.original.id}-${row.original.role}`}
        currentUserId={currentUserId}
        user={row.original}
      />
    ),
  },
  {
    id: "accessStatus",
    accessorFn: (row) => (row.banned ? "banned" : "active"),
    header: "Access",
    filterFn: (row, columnId, value: UserAccessFilter[]) =>
      matchesMultiValueFilter(row, columnId, value),
    cell: ({ row }) => <AccessCell user={row.original} />,
  },
  {
    id: "verificationStatus",
    accessorFn: (row) => (row.emailVerified ? "verified" : "unverified"),
    header: "Email",
    filterFn: (row, columnId, value: UserVerificationFilter[]) =>
      matchesMultiValueFilter(row, columnId, value),
    cell: ({ row }) => <VerificationCell user={row.original} />,
  },
  {
    accessorKey: "sessionCount",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Sessions" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <RefreshCcwIcon className="size-4" />
        <span>{formatNumberTruncate(row.original.sessionCount)}</span>
      </div>
    ),
  },
  {
    accessorKey: "commentCount",
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Comments" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-4" />
        <span>{formatNumberTruncate(row.original.commentCount)}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTableSortableColumnHeader title="Created At" column={column} />
    ),
    sortingFn: "datetime",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionCell currentUserId={currentUserId} user={row.original} />
    ),
    enableHiding: false,
  },
];

const Toolbar = ({
  table,
  currentUserId,
}: {
  table: Table<UserRow>;
  currentUserId: string;
}) => {
  const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <div className="relative w-full max-w-xl">
          <div className="absolute top-0 bottom-0 left-0 flex items-center px-3">
            <SearchIcon className="size-4" />
          </div>
          <Input
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            placeholder="Search users by name, email, or username..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={[
              {
                key: "admin",
                value: "admin",
                label: (
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="size-4" />
                    Admin
                  </div>
                ),
              },
              {
                key: "user",
                value: "user",
                label: (
                  <div className="flex items-center gap-2">
                    <UsersIcon className="size-4" />
                    User
                  </div>
                ),
              },
            ]}
          />
          <DataTableFacetedFilter
            column={table.getColumn("accessStatus")}
            title="Access"
            options={[
              {
                key: "active",
                value: "active",
                label: (
                  <div className="flex items-center gap-2">
                    <CircleCheckIcon className="size-4" />
                    Active
                  </div>
                ),
              },
              {
                key: "banned",
                value: "banned",
                label: (
                  <div className="flex items-center gap-2">
                    <BanIcon className="size-4" />
                    Banned
                  </div>
                ),
              },
            ]}
          />
          <DataTableFacetedFilter
            column={table.getColumn("verificationStatus")}
            title="Email"
            options={[
              {
                key: "verified",
                value: "verified",
                label: (
                  <div className="flex items-center gap-2">
                    <MailCheckIcon className="size-4" />
                    Verified
                  </div>
                ),
              },
              {
                key: "unverified",
                value: "unverified",
                label: (
                  <div className="flex items-center gap-2">
                    <MailXIcon className="size-4" />
                    Unverified
                  </div>
                ),
              },
            ]}
          />
          <Select
            value={getSortValue(table)}
            onValueChange={(value: UserSortOption) =>
              setTableSort(table, value)
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Order by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
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
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-muted-foreground">
          {hiddenRows > 0
            ? `${hiddenRows} ${hiddenRows === 1 ? "row" : "rows"} hidden by your filters`
            : "Showing every user that matches your current filters."}
        </div>
        {table.getSelectedRowModel().rows.length > 0 && (
          <SelectedRowActions currentUserId={currentUserId} table={table} />
        )}
      </div>
    </div>
  );
};

export const UserListTable = ({
  currentUserId,
  users,
}: {
  currentUserId: string;
  users: GetUsersType;
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <DataTable
        data={users}
        columns={getColumns(currentUserId)}
        noResultsMessage="No users found."
        ToolbarComponent={(props) => (
          <Toolbar {...props} currentUserId={currentUserId} />
        )}
        tableClassName="min-w-[88rem]"
        getRowId={(row) => row.id}
      />
    </div>
  );
};

const RoleCell = ({
  currentUserId,
  user,
}: {
  currentUserId: string;
  user: UserRow;
}) => {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [isPending, startTransition] = useTransition();
  const isCurrentUser = user.id === currentUserId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button variant="ghost" className="justify-start px-2">
          {role === "admin" ? <ShieldIcon /> : <UsersIcon />}
          {role === "admin" ? "Admin" : "User"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          disabled={role === "admin"}
          onClick={() => {
            startTransition(async () => {
              const response = await updateUsersRole([user.id], "admin");

              if (response.error) {
                toast.error(response.message);
                return;
              }

              setRole("admin");
              toast.success(response.message);
              router.refresh();
            });
          }}
        >
          <ShieldIcon />
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={role === "user" || isCurrentUser}
          onClick={() => {
            startTransition(async () => {
              const response = await updateUsersRole([user.id], "user");

              if (response.error) {
                toast.error(response.message);
                return;
              }

              setRole("user");
              toast.success(response.message);
              router.refresh();
            });
          }}
        >
          <UsersIcon />
          User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AccessCell = ({ user }: { user: UserRow }) => {
  if (!user.banned) {
    return (
      <Badge variant="secondary" className="rounded-full">
        <CircleCheckIcon />
        Active
      </Badge>
    );
  }

  const banExpiresText = user.banExpires
    ? `Lifts ${formatDate(user.banExpires)}`
    : "Permanent";

  return (
    <div className="space-y-1">
      <Badge variant="destructive" className="rounded-full">
        <ShieldAlertIcon />
        Banned - {banExpiresText}
      </Badge>
    </div>
  );
};

const VerificationCell = ({ user }: { user: UserRow }) => {
  if (user.emailVerified) {
    return (
      <Badge variant="secondary" className="rounded-full">
        <BadgeCheckIcon />
        Verified
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="rounded-full">
      <MailXIcon />
      Unverified
    </Badge>
  );
};

const ActionCell = ({
  currentUserId,
  user,
}: {
  currentUserId: string;
  user: UserRow;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmationText, setConfirmationText] = useState({
    title: "",
    description: "",
  });
  const [ConfirmationDialog, confirm] = useConfirm(
    confirmationText.title,
    confirmationText.description,
  );
  const isCurrentUser = user.id === currentUserId;

  const runConfirmedAction = async ({
    title,
    description,
    action,
  }: {
    title: string;
    description: string;
    action: () => Promise<{ error: boolean; message: string }>;
  }) => {
    if (isPending) return;

    setConfirmationText({ title, description });
    const isConfirmed = await confirm();
    if (!isConfirmed) return;

    startTransition(async () => {
      const response = await action();

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    });
  };

  const toggleEmailVerification = async () => {
    if (isPending) return;

    startTransition(async () => {
      const response = await updateUsersEmailVerification(
        [user.id],
        !user.emailVerified,
      );

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPending}>
          <Button variant="ghost" size="icon-sm">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={toggleEmailVerification}>
            {user.emailVerified ? <MailXIcon /> : <MailCheckIcon />}
            {user.emailVerified ? "Mark Unverified" : "Mark Verified"}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isCurrentUser}
            onClick={() =>
              runConfirmedAction({
                title: "Revoke User Sessions",
                description: `This will sign ${user.name} out of every active session immediately.`,
                action: () => revokeUsersSessions([user.id]),
              })
            }
          >
            <RefreshCcwIcon />
            Revoke Sessions
          </DropdownMenuItem>
          {user.banned ? (
            <DropdownMenuItem
              onClick={() =>
                runConfirmedAction({
                  title: "Unban User",
                  description: `${user.name} will regain access as soon as they sign in again.`,
                  action: () => unbanUsers([user.id]),
                })
              }
            >
              <CircleCheckIcon />
              Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isCurrentUser}>
                <BanIcon />
                Ban User
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {BAN_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.key}
                    onClick={() =>
                      runConfirmedAction({
                        title: option.label,
                        description: `${option.description} ${user.name} will be signed out right away.`,
                        action: () => banUsers([user.id], option.key),
                      })
                    }
                  >
                    <ShieldAlertIcon />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isCurrentUser}
            className="text-destructive focus:text-destructive"
            onClick={() =>
              runConfirmedAction({
                title: "Delete User",
                description: `Deleting ${user.name} will permanently remove their account, sessions, and linked auth records.`,
                action: () => deleteUsers([user.id]),
              })
            }
          >
            <Trash2Icon className="text-destructive" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const SelectedRowActions = ({
  currentUserId,
  table,
}: {
  currentUserId: string;
  table: Table<UserRow>;
}) => {
  const router = useRouter();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedUsers = selectedRows.map((row) => row.original);
  const selectedUserIds = selectedUsers.map((row) => row.id);
  const selectedCount = selectedUserIds.length;
  const includesCurrentUser = selectedUserIds.includes(currentUserId);
  const [isPending, startTransition] = useTransition();
  const [confirmationText, setConfirmationText] = useState({
    title: "",
    description: "",
  });
  const [ConfirmationDialog, confirm] = useConfirm(
    confirmationText.title,
    confirmationText.description,
  );

  const runConfirmedAction = async ({
    title,
    description,
    action,
  }: {
    title: string;
    description: string;
    action: () => Promise<{ error: boolean; message: string }>;
  }) => {
    if (isPending) return;

    setConfirmationText({ title, description });
    const isConfirmed = await confirm();
    if (!isConfirmed) return;

    startTransition(async () => {
      const response = await action();

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      table.resetRowSelection();
      router.refresh();
    });
  };

  const runQuickAction = async (
    action: () => Promise<{ error: boolean; message: string }>,
  ) => {
    if (isPending) return;

    startTransition(async () => {
      const response = await action();

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      table.resetRowSelection();
      router.refresh();
    });
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
        <div className="text-sm text-muted-foreground">
          {selectedCount} {selectedCount === 1 ? "row" : "rows"} selected
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isPending}>
            <Button variant="outline" size="sm">
              <UserCogIcon />
              Set Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                runQuickAction(() => updateUsersRole(selectedUserIds, "admin"))
              }
            >
              <ShieldIcon />
              Make Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={includesCurrentUser}
              onClick={() =>
                runQuickAction(() => updateUsersRole(selectedUserIds, "user"))
              }
            >
              <UsersIcon />
              Make User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            disabled={isPending || includesCurrentUser}
          >
            <Button variant="outline" size="sm">
              <BanIcon />
              Ban
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {BAN_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.key}
                onClick={() =>
                  runConfirmedAction({
                    title: option.label,
                    description: `${option.description} ${selectedCount} selected ${
                      selectedCount === 1 ? "account" : "accounts"
                    } will be signed out immediately.`,
                    action: () => banUsers(selectedUserIds, option.key),
                  })
                }
              >
                <ShieldAlertIcon />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() =>
            runConfirmedAction({
              title: "Unban Users",
              description: `Restore access for ${selectedCount} selected ${
                selectedCount === 1 ? "user" : "users"
              }.`,
              action: () => unbanUsers(selectedUserIds),
            })
          }
        >
          <CircleCheckIcon />
          Unban
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isPending}>
            <Button variant="outline" size="sm">
              <MailCheckIcon />
              Email
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                runQuickAction(() =>
                  updateUsersEmailVerification(selectedUserIds, true),
                )
              }
            >
              <MailCheckIcon />
              Mark Verified
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                runQuickAction(() =>
                  updateUsersEmailVerification(selectedUserIds, false),
                )
              }
            >
              <MailXIcon />
              Mark Unverified
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending || includesCurrentUser}
          onClick={() =>
            runConfirmedAction({
              title: "Revoke User Sessions",
              description: `This will sign ${selectedCount} selected ${
                selectedCount === 1 ? "user" : "users"
              } out everywhere.`,
              action: () => revokeUsersSessions(selectedUserIds),
            })
          }
        >
          <RefreshCcwIcon />
          Revoke Sessions
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending || includesCurrentUser}
          onClick={() =>
            runConfirmedAction({
              title: "Delete Users",
              description: `Deleting ${selectedCount} selected ${
                selectedCount === 1 ? "account" : "accounts"
              } will permanently remove their users, sessions, and auth records.`,
              action: () => deleteUsers(selectedUserIds),
            })
          }
        >
          <Trash2Icon />
          Delete
        </Button>
      </div>
    </>
  );
};

import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { Suspense } from "react";
import { getUsers } from "@/features/user/actions/action";
import { UserListTable } from "@/features/user/components/user-list-table";

const AdminUsersPage = () => {
  return (
    <div className="space-y-4 px-6 py-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage roles, access, verification, sessions, and bulk user actions.
        </p>
      </div>
      <Suspense>
        <AdminUsersSuspense />
      </Suspense>
    </div>
  );
};

const AdminUsersSuspense = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (!userId || !user || user.role !== "admin") return null;

  const users = await getUsers();

  return <UserListTable currentUserId={userId} users={users} />;
};

export default AdminUsersPage;

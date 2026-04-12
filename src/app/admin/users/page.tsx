import { getCurrentUser } from "@/lib/auth/auth-helpers";
import { Suspense } from "react";
import { getUsers } from "@/features/user/actions/action";
import { UserListTable } from "@/features/user/components/user-list-table";
import { AdminTableSkeleton } from "@/components/async-states";
import { AsyncErrorBoundary } from "@/components/async-error-boundary";

const AdminUsersPage = () => {
  return (
    <div className="space-y-4 px-6 py-10">
      <h1 className="text-3xl font-bold">Users</h1>
      <Suspense fallback={<AdminTableSkeleton columns={7} />}>
        <AsyncErrorBoundary
          title="Couldn't load users"
          description="User management data is unavailable right now. Please retry in a moment."
        >
          <AdminUsersSuspense />
        </AsyncErrorBoundary>
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

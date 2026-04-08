import { Outlet } from "react-router";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminLayoutRoute() {
  return (
    <AdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminRoute>
  );
}

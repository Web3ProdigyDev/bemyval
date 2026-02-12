import { Metadata } from "next";
import AdminDashboard from "@/src/pages/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: "noindex, nofollow",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}

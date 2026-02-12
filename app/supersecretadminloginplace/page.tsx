import { Metadata } from "next";
import AdminLogin from "@/src/pages/supersecretadminloginplace";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: "noindex, nofollow",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}

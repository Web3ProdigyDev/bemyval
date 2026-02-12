import { Metadata } from "next";
import Index from "@/src/pages/Index";

export const metadata: Metadata = {
  title: "BeMyVal - Your Personal Valentine Gift",
  description: "Create and share your personalized Valentine wishes",
};

export default function Home() {
  return <Index />;
}

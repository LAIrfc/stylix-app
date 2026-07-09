import type { Metadata } from "next";
import { DailyClient } from "./DailyClient";

export const metadata: Metadata = {
  title: "Daily 每日身份 - Stylix",
};

export default function DailyPage() {
  return <DailyClient />;
}

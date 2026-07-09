import type { Metadata } from "next";
import { ResultClient } from "./ResultClient";

export const metadata: Metadata = {
  title: "今日珠宝身份卡 - Stylix",
};

export default function ResultPage() {
  return <ResultClient />;
}

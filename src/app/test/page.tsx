import type { Metadata } from "next";
import { TestClient } from "./TestClient";

export const metadata: Metadata = {
  title: "JMTI 珠宝人格测试 - Stylix",
};

export default function TestPage() {
  return <TestClient />;
}

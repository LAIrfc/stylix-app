import type { Metadata } from "next";
import { MemberClient } from "./MemberClient";

export const metadata: Metadata = {
  title: "会员中心 - Stylix",
};

export default function MemberPage() {
  return <MemberClient />;
}

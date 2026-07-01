import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile — Stylix",
};

export default function ProfilePage() {
  return <ProfileClient />;
}

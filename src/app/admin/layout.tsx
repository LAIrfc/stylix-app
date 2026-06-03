export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin pages get their own layout — no site header/footer
  return <>{children}</>;
}

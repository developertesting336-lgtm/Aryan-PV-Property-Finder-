import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="container-wide flex min-h-[70vh] items-center justify-center py-20">
      <AuthForm mode="login" />
    </main>
  );
}

import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="container-wide flex min-h-[70vh] items-center justify-center py-20">
      <AuthForm mode="signup" />
    </main>
  );
}

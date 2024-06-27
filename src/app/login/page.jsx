"use client";
import Link from "next/link";
import { loginInputs } from "./data";
import AuthForm from "@/app/UiComponents/FormComponents/Forms/AuthFrom/AuthForm";
import { useAuth } from "@/app/context/AuthProvider/AuthProvider";
import { handleRequestSubmit } from "@/helpers/functions/handleRequestSubmit";
import { useToastContext } from "@/app/context/ToastLoading/ToastLoadingProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setLoading } = useToastContext();
  const { setUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();

  async function handleLogin(data) {
    const req = await handleRequestSubmit(
      data,
      setLoading,
      "auth/login",
      false,
      "جاري تسجيل الدخول",
    );
    if (req.status === 200) {
      if (req.user) {
        setUser(req.user);
        setIsLoggedIn(true);
        router.push("/");
      }
    }
  }

  if (isLoggedIn) {
    router.push("/");
    return;
  }
  return (
    <>
      <AuthForm
        btnText={"تسجيل الدخول"}
        inputs={loginInputs}
        formTitle={"تسجيل الدخول"}
        onSubmit={handleLogin}
      >
        <Link href={"/reset-password"}>نسيت كلمة السر؟</Link>
      </AuthForm>
    </>
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { login, clearError } from "@/domains/auth/slice";
import { AuthPage } from "@/domains/auth/components/AuthPage";
import type { AppDispatch, RootState } from "@/app/store";

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      toast.error("L'email est requis");
      return;
    }
    if (!password) {
      toast.error("Le mot de passe est requis");
      return;
    }

    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/home");
    } else {
      toast.error(result.payload as string ?? "Email ou mot de passe incorrect");
    }
  };

  return (
    <AuthPage
      mode="login"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      linkTo="/register"
      linkText="Pas encore de compte ?"
      linkLabel="S'inscrire"
      fields={[
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "votre@email.com",
          icon: <Mail className="size-4" />,
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
        },
        {
          id: "password",
          label: "Mot de passe",
          type: "password",
          placeholder: "••••••••",
          icon: <Lock className="size-4" />,
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
        },
      ]}
    />
  );
}

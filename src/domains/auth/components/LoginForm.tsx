import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { login, clearError } from "@/domains/auth/slice";
import { AuthPage } from "@/domains/auth/components/AuthPage";
import type { AppDispatch, RootState } from "@/app/store";

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/home");
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
          fieldError: error ?? undefined,
        },
      ]}
    />
  );
}

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { register, clearError } from "@/domains/auth/slice";
import { AuthPage } from "@/domains/auth/components/AuthPage";
import type { AppDispatch, RootState } from "@/app/store";

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    dispatch(clearError());

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const result = await dispatch(register({ email, username, password }));
    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  const emailError = error === "Email déjà utilisé" ? error : undefined;
  const usernameError = error === "Nom d'utilisateur déjà utilisé" ? error : undefined;

  return (
    <AuthPage
      mode="register"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      linkTo="/login"
      linkText="Déjà un compte ?"
      linkLabel="Se connecter"
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
          fieldError: emailError,
        },
        {
          id: "username",
          label: "Nom d'utilisateur",
          type: "text",
          placeholder: "johndoe",
          icon: <User className="size-4" />,
          value: username,
          onChange: (e) => setUsername(e.target.value),
          required: true,
          fieldError: usernameError,
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
          minLength: 6,
        },
        {
          id: "confirmPassword",
          label: "Confirmer le mot de passe",
          type: "password",
          placeholder: "••••••••",
          icon: <Lock className="size-4" />,
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          required: true,
          fieldError: localError ?? undefined,
        },
      ]}
    />
  );
}

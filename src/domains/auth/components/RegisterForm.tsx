import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { register, clearError } from "@/domains/auth/slice";
import { AuthPage } from "@/domains/auth/components/AuthPage";
import type { AppDispatch, RootState } from "@/app/store";

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    dispatch(clearError());

    if (!email) {
      toast.error("L'email est requis");
      return;
    }
    if (!username) {
      toast.error("Le nom d'utilisateur est requis");
      return;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const result = await dispatch(register({ email, username, password }));
    if (register.fulfilled.match(result)) {
      navigate("/login");
    } else {
      toast.error(result.payload as string ?? "Erreur lors de l'inscription");
    }
  };

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
        },
      ]}
    />
  );
}

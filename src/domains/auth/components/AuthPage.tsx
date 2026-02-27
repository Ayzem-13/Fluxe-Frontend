import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FluxeLogo } from "@/components/FluxeLogo";
import type { AuthPageProps } from "@/domains/auth/types";

const formVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function AuthPage({ mode, fields, onSubmit, isLoading, linkTo, linkLabel, linkText }: AuthPageProps) {
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  const toggleVisibility = (id: string) => {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-card border-r border-border p-12">
        <div className="flex items-center gap-3">
          <FluxeLogo className="size-10" />
          <span className="text-2xl font-bold">Fluxe</span>
        </div>
        <div className="flex justify-center">
          <FluxeLogo className="size-56 opacity-90" />
        </div>
        <div>
          <p className="text-xl font-semibold text-foreground">
            "Partagez vos idées avec le monde, en un instant."
          </p>
          <p className="mt-2 text-sm text-muted-foreground">— L'équipe Fluxe</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-12 sm:px-12">
        <motion.div
          className="mx-auto w-full max-w-sm"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <FluxeLogo className="size-8" />
            <span className="text-xl font-bold">Fluxe</span>
          </div>

          <h2 className="text-2xl font-bold">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            {mode === "login" ? "Content de vous revoir." : "Rejoignez Fluxe dès maintenant."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex flex-col gap-4"
          >
            {fields.map((field, i) => {
              const isPassword = field.type === "password";
              const isVisible = visibleFields.has(field.id);
              return (
                <motion.div
                  key={field.id}
                  className="flex flex-col gap-1.5"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                >
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {field.icon}
                    </div>
                    <Input
                      id={field.id}
                      type={isPassword && isVisible ? "text" : field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      minLength={field.minLength}
                      required={field.required}
                      className="pl-9 pr-9"
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Chargement..." : mode === "login" ? "Se connecter" : "S'inscrire"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            {linkText}{" "}
            <Link to={linkTo} className="font-semibold text-foreground hover:underline">
              {linkLabel}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

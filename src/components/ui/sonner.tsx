import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium shadow-lg",
          icon: "shrink-0 size-8 rounded-full flex items-center justify-center",
          success: "[&>[data-icon]]:bg-green-500/15 [&>[data-icon]]:text-green-500",
          error: "[&>[data-icon]]:bg-red-500/15 [&>[data-icon]]:text-red-400",
          warning: "[&>[data-icon]]:bg-yellow-500/15 [&>[data-icon]]:text-yellow-400",
          info: "[&>[data-icon]]:bg-blue-500/15 [&>[data-icon]]:text-blue-400",
          title: "text-foreground",
          description: "text-muted-foreground text-xs mt-0.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

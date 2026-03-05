import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ trigger, title, description, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[320px] max-w-[90vw] rounded-[24px] p-8 gap-6 shadow-xl border-none">
        <AlertDialogHeader className="text-left space-y-2">
          <AlertDialogTitle className="text-xl font-extrabold w-full">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-muted-foreground leading-snug w-full">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-3 w-full mt-2">
          <AlertDialogPrimitive.Action asChild>
            <button
              onClick={onConfirm}
              className="w-full flex items-center justify-center rounded-full bg-[#f4212e] hover:bg-[#e01e2a] text-white font-bold h-12 text-[15px] shadow-none border-none cursor-pointer outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              Supprimer
            </button>
          </AlertDialogPrimitive.Action>
          <AlertDialogPrimitive.Cancel asChild>
            <button className="w-full flex items-center justify-center rounded-full border border-border/50 hover:bg-accent hover:text-foreground text-foreground font-bold h-12 text-[15px] shadow-none bg-transparent cursor-pointer outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors m-0">
              Annuler
            </button>
          </AlertDialogPrimitive.Cancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

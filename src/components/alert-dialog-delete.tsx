import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

const AlertDialogDelete = ({
  title,
  description,
  children,
  cancel,
  deleteT,
  onDelete,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onDelete?: () => void;
  cancel?: string;
  deleteT?: string;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <VisuallyHidden>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </VisuallyHidden>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>{deleteT}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogDelete;

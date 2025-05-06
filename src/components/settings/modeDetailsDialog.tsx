import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchedulingMode } from "@/types/mode";
import { getIconForMode } from "@/lib/modes";
import { Copy, Edit, Loader2, Save, Settings, Trash } from "lucide-react";
import ViewModeDetails from "./viewModeDetails";
import EditModeDialog from "./editMode";
import { useTranslations } from "next-intl";
import AlertDialogDelete from "../alert-dialog-delete";

interface ModeDetailsDialogProps {
  mode: SchedulingMode;
  selectedMode: SchedulingMode | null;
  setSelectedMode: React.Dispatch<React.SetStateAction<SchedulingMode | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateMode: () => void;
  handleDeleteMode: (id: string) => void;
  handleCopyMode: (mode: SchedulingMode) => void;
  updateModeMutation: {
    isPending: boolean;
  };
  deleteModeMutation: {
    isPending: boolean;
  };
  createModeMutation: {
    isPending: boolean;
  };
}

const ModeDetailsDialog = ({
  mode,
  selectedMode,
  setSelectedMode,
  isEditing,
  setIsEditing,
  handleUpdateMode,
  handleDeleteMode,
  handleCopyMode,
  updateModeMutation,
  deleteModeMutation,
  createModeMutation,
}: ModeDetailsDialogProps) => {
  const t = useTranslations("settings.preferences");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => {
            setSelectedMode({
              ...mode,
              icon: getIconForMode({ ...mode, icon: undefined }),
            });
            setIsEditing(false);
          }}
        >
          <Settings className="h-3.5 w-3.5" />
          {t("viewDetails")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedMode?.icon}

            {mode.isBuiltIn
              ? t(
                  `modes.${mode?.name.toLowerCase().replace(/\s+/g, "_")}.title`
                )
              : mode.name}
            {/* {selectedMode?.isPreferred && (
              <Badge variant="secondary" className="ml-2">
                Default
              </Badge>
            )} */}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("editSchedulingMode")
              : mode.isBuiltIn
              ? t(
                  `modes.${mode?.name
                    .toLowerCase()
                    .replace(/\s+/g, "_")}.description`
                )
              : mode.description}
          </DialogDescription>
        </DialogHeader>

        {selectedMode && (
          <div className="py-4">
            {isEditing ? (
              // Edit mode
              <EditModeDialog
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
              />
            ) : (
              // View mode
              <ViewModeDetails selectedMode={selectedMode} />
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between items-center gap-2">
          <div className="flex gap-2 w-full">
            {!selectedMode?.isBuiltIn && (
              <AlertDialogDelete
                title={t("deleteDialog.title")}
                description={t("deleteDialog.description")}
                children={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive w-full sm:w-auto"
                    disabled={deleteModeMutation.isPending}
                  >
                    {deleteModeMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash className="h-3.5 w-3.5" />
                    )}
                    {t("deleteDialog.delete")}
                  </Button>
                }
                isDeleting={deleteModeMutation.isPending}
                cancel={t("deleteDialog.cancel")}
                deleteT={t("deleteDialog.delete")}
                onDelete={() => {
                  if (selectedMode) handleDeleteMode(selectedMode.id);
                }}
              />
            )}

            {selectedMode?.isBuiltIn && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  if (selectedMode) handleCopyMode(selectedMode);
                }}
                disabled={createModeMutation.isPending}
              >
                {createModeMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {t("makeCopy")}
              </Button>
            )}
          </div>

          <div className="w-full gap-2 flex flex-col sm:flex-row sm:justify-end ">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={updateModeMutation.isPending}
                >
                  {t("cancel")}
                </Button>
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={handleUpdateMode}
                  disabled={updateModeMutation.isPending}
                >
                  {updateModeMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  {t("saveChanges")}
                </Button>
              </>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    {t("close")}
                  </Button>
                </DialogClose>
                {!selectedMode?.isBuiltIn && (
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    {t("edit")}
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModeDetailsDialog;

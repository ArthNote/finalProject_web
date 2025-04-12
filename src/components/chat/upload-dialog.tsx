import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface UploadDialogProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  onUpload: () => void;
  isLoading: boolean;
}

export function UploadDialog({
  file,
  isOpen,
  onClose,
  onUpload,
  isLoading,
}: UploadDialogProps) {
  const t = useTranslations("chat");

  console.log("UploadDialog render:", {
    hasFile: !!file,
    isOpen,
    isLoading,
    fileType: file?.type,
    fileName: file?.name,
  });

  // Create preview URL when file changes
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log("File changed in upload dialog:", file);

    // Clean up previous preview
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }

    if (file && file.type.startsWith("image/")) {
      try {
        console.log("Creating preview for image:", file.name);
        const url = URL.createObjectURL(file);
        setPreview(url);
      } catch (error) {
        console.error("Error creating preview:", error);
      }
    }

    // Clean up on unmount
    return () => {
      if (preview) {
        console.log("Cleaning up preview URL");
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  // If not open, don't render
  if (!isOpen) return null;

  // If no file but dialog is open
  if (!file) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("upload.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t("upload.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("upload.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            {file.type.startsWith("image/") ? (
              <div className="relative aspect-video">
                {preview ? (
                  <Image
                    src={preview}
                    alt={file.name}
                    fill
                    className="object-contain rounded-md"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("upload.cancel")}
          </Button>
          <Button onClick={onUpload} disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("upload.sending")}
              </>
            ) : (
              t("upload.send")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

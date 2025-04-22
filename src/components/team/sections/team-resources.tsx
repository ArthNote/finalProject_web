import React, { useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileIcon,
  Link as LinkIcon,
  Upload,
  Download,
  File,
  FileCode,
  Image,
  FileText,
  FileSpreadsheet,
  MoreHorizontal,
  Trash,
  Share,
  Eye,
  FilesIcon,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTeam } from "../team-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResource, deleteResource } from "@/lib/api/teams";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { UploadDialog } from "@/components/chat/upload-dialog";

const SharedResources = () => {
  const { team } = useTeam();
  const [resourcesTab, setResourcesTab] = useState("files");
  const [newLinkOpen, setNewLinkOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const t = useTranslations("team.resources");

  // Filter files based on search query
  const filteredFiles = team.resources.filter(
    (file) =>
      (file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())) &&
      file.type === "file"
  );

  // Filter links based on search query
  const filteredLinks = team.resources.filter(
    (link) =>
      (link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())) &&
      link.type === "link"
  );

  const { mutate: addResource, isPending: isCreating } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["team"], type: "all" }),
      ]);
      toast({
        title: t("toast.createSuccess.title"),
        description: t("toast.createSuccess.description"),
      });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: t("toast.createError.title"),
        description: t("toast.createError.description"),
        variant: "destructive",
      });
    },
  });

  const { mutate: removeResource, isPending: isDeleting } = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({ queryKey: ["team"], type: "all" }),
      ]);
      toast({
        title: t("toast.deleteSuccess.title"),
        description: t("toast.deleteSuccess.description"),
      });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: t("toast.deleteError.title"),
        description: t("toast.deleteError.description"),
        variant: "destructive",
      });
    },
  });

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t("toast.copySuccess.title"),
        description: t("toast.copySuccess.description"),
      });
    } catch (err) {
      toast({
        title: t("toast.copyError.title"),
        description: t("toast.copyError.description"),
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log("File download initiated: ", fileName);

      toast({
        title: t("toast.downloadSuccess.title"),
        description: t("toast.downloadSuccess.description"),
      });
    } catch (err) {
      toast({
        title: t("toast.downloadError.title"),
        description: t("toast.downloadError.description"),
        variant: "destructive",
      });
    }
  };

  const handleFileButtonClick = () => {
    console.log("File button clicked");
    if (fileInputRef.current) {
      console.log("Clicking file input");
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed event triggered");

    if (!e.target.files) {
      console.log("No files in event target");
      return;
    }

    console.log(
      "Files array:",
      Array.from(e.target.files).map((f) => f.name)
    );

    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Increased to 40MB to stay under server limit
    const maxSize = 40 * 1024 * 1024; // 40MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size);
      toast({
        variant: "destructive",
        title: t("toast.fileTooLarge.title"),
        description: t("toast.fileTooLarge.description"),
      });
      return;
    }

    // Open dialog first, then set the file
    console.log("Opening upload dialog and setting file");
    setSelectedFile(file);
    setIsUploadDialogOpen(true);
  };

  const handleAddFile = () => {
    if (!selectedFile) {
      console.log("No file selected for upload");
      return;
    }
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onerror = (error) => {
        console.error("Error reading file:", error);

        toast({
          variant: "destructive",
          title: t("toast.errorReneringFile.title"),
          description: t("toast.errorReneringFile.description"),
        });
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
        return;
      };

      reader.onload = async () => {
        try {
          console.log(
            "File converted to base64, length:",
            (reader.result as string).length
          );

          const base64 = reader.result as string;

          addResource({
            name: selectedFile.name,
            fileName: selectedFile.name,
            type: "file",
            fileData: base64,
            fileSize: selectedFile.size,
          });
        } catch (error) {
          console.error("API error during upload:", error);

          toast({
            variant: "destructive",
            title: t("toast.errorReneringFile.title"),
            description: t("toast.errorReneringFile.description"),
          });
          setIsUploadDialogOpen(false);
          setSelectedFile(null);
          return;
        }
      };
    } catch (error) {
      console.error("Error during file upload:", error);
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    }
  };

  // Mock function to add link
  const handleAddLink = () => {
    if (!newLinkTitle || !newLinkUrl) {
      return;
    }

    addResource({
      name: newLinkTitle,
      type: "link",
      url: newLinkUrl,
    });
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkOpen(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-destructive" />;
      case "doc":
        return <FileText className="h-5 w-5 text-primary" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-priority-low" />;
      case "image":
        return <Image className="h-5 w-5 text-priority-medium" />;
      case "zip":
        return <FileCode className="h-5 w-5 text-muted-foreground" />;
      default:
        return <FileIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>{t("title")}</CardTitle>
                  <CardDescription>{t("description")}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={newLinkOpen} onOpenChange={setNewLinkOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={isCreating}>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {t("addLink.addLink")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("addLink.title")}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="title"
                            className="text-sm font-medium"
                          >
                            {t("addLink.titleLabel")}
                          </label>
                          <Input
                            id="title"
                            placeholder={t("addLink.titlePlaceholder")}
                            value={newLinkTitle}
                            disabled={isCreating}
                            onChange={(e) => setNewLinkTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="url" className="text-sm font-medium">
                            {t("addLink.urlLabel")}
                          </label>
                          <Input
                            id="url"
                            placeholder={t("addLink.urlPlaceholder")}
                            value={newLinkUrl}
                            disabled={isCreating}
                            onChange={(e) => setNewLinkUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          disabled={isCreating}
                          onClick={() => setNewLinkOpen(false)}
                        >
                          {t("addLink.cancel")}
                        </Button>
                        <Button onClick={handleAddLink}>
                          {t("addLink.add")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handleFileButtonClick} disabled={isCreating}>
                    <Upload className="h-4 w-4 mr-2" />
                    {t("uploadFile")}
                  </Button>
                </div>
              </div>
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={resourcesTab}
              onValueChange={setResourcesTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-[200px] mb-4">
                <TabsTrigger value="files">
                  <FilesIcon className="h-4 w-4 mr-2" />
                  {t("tabs.files")}
                </TabsTrigger>
                <TabsTrigger value="links">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {t("tabs.links")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="files" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("files.name")}</TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("files.size")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("files.uploadedBy")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("files.uploadedOn")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("files.actions.label")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <span>{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {file.size !== undefined
                            ? file.size < 1024
                              ? `${file.size} B`
                              : file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {file.uploadedBy}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDownloadFile(file.url, file.name)
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                <span>{t("files.actions.download")}</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => removeResource(file.id)}
                              >
                                <Trash className="h-4 w-4 mr-2 text-destructive" />
                                <span className="text-destructive">
                                  {t("files.actions.delete")}
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredFiles.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    {t("files.nofilesSearch")}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("links.title")}</TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("links.url")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("links.uploadedBy")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("links.uploadedOn")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("links.actions.label")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <LinkIcon className="h-4 w-4 text-primary" />
                            <span>{link.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate max-w-[200px] inline-block"
                          >
                            {link.url.replace(/^https?:\/\//, "")}
                          </a>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {link.uploadedBy}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  <span>{t("links.actions.open")}</span>
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCopyLink(link.url)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                <span>{t("links.actions.copy")}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => removeResource(link.id)}
                              >
                                <Trash className="h-4 w-4 mr-2 text-destructive" />
                                <span className="text-destructive">
                                  {t("links.actions.delete")}
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredLinks.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    {t("links.nolinksSearch")}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <UploadDialog
        file={selectedFile!}
        isOpen={isUploadDialogOpen}
        onClose={() => {
          setIsUploadDialogOpen(false);
          setSelectedFile(null);
        }}
        onUpload={handleAddFile}
        isLoading={isCreating}
      />

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
    </>
  );
};

export default SharedResources;

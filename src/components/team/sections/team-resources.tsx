import React, { useState } from "react";
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
import { toast } from "sonner";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Mock data for shared resources
const initialFiles = [
  {
    id: 1,
    name: "Project Proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Sarah Johnson",
    lastModified: "2025-04-01",
  },
  {
    id: 2,
    name: "Design Assets.zip",
    type: "zip",
    size: "14.8 MB",
    uploadedBy: "Michael Chen",
    lastModified: "2025-04-02",
  },
  {
    id: 3,
    name: "Meeting Notes.docx",
    type: "doc",
    size: "342 KB",
    uploadedBy: "Jessica Williams",
    lastModified: "2025-04-03",
  },
  {
    id: 4,
    name: "Budget Forecast.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    uploadedBy: "David Miller",
    lastModified: "2025-03-29",
  },
  {
    id: 5,
    name: "Logo Design.png",
    type: "image",
    size: "4.7 MB",
    uploadedBy: "Emily Davis",
    lastModified: "2025-03-27",
  },
];

const initialLinks = [
  {
    id: 1,
    title: "Product Roadmap",
    url: "https://example.com/roadmap",
    addedBy: "Sarah Johnson",
    addedOn: "2025-04-01",
  },
  {
    id: 2,
    title: "Design System Documentation",
    url: "https://example.com/design-system",
    addedBy: "Michael Chen",
    addedOn: "2025-04-02",
  },
  {
    id: 3,
    title: "Company Wiki",
    url: "https://example.com/wiki",
    addedBy: "Jessica Williams",
    addedOn: "2025-03-25",
  },
];

const SharedResources = () => {
  const [files, setFiles] = useState(initialFiles);
  const [links, setLinks] = useState(initialLinks);
  const [resourcesTab, setResourcesTab] = useState("files");
  const [newLinkOpen, setNewLinkOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter files based on search query
  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter links based on search query
  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.addedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock function to upload file
  const handleFileUpload = () => {
    toast.info("File upload functionality would be implemented here");
  };

  // Mock function to add link
  const handleAddLink = () => {
    if (!newLinkTitle || !newLinkUrl) {
      toast.error("Please enter both a title and URL");
      return;
    }

    const newLink = {
      id: links.length + 1,
      title: newLinkTitle,
      url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
      addedBy: "Current User",
      addedOn: new Date().toISOString().split("T")[0],
    };

    setLinks([...links, newLink]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkOpen(false);
    toast.success("Link added successfully");
  };

  // Mock function to delete resource
  const handleDeleteResource = (id: number, type: "file" | "link") => {
    if (type === "file") {
      setFiles(files.filter((file) => file.id !== id));
    } else {
      setLinks(links.filter((link) => link.id !== id));
    }
    toast.success(`${type === "file" ? "File" : "Link"} removed successfully`);
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Shared Resources</CardTitle>
                <CardDescription>
                  Access team files, notes, and links
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={newLinkOpen} onOpenChange={setNewLinkOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Resource Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="title"
                          placeholder="Resource title"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium">
                          URL
                        </label>
                        <Input
                          id="url"
                          placeholder="https://example.com"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setNewLinkOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddLink}>Add Link</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button onClick={handleFileUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
            <Input
              placeholder="Search resources..."
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
                Files
              </TabsTrigger>
              <TabsTrigger value="links">
                <LinkIcon className="h-4 w-4 mr-2" />
                Links
              </TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Uploaded By
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last Modified
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        {file.size}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {file.uploadedBy}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(file.lastModified).toLocaleDateString()}
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
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteResource(file.id, "file")
                              }
                            >
                              <Trash className="h-4 w-4 mr-2 text-destructive" />
                              <span className="text-destructive">Delete</span>
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
                  No files found matching your search
                </div>
              )}
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">URL</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Added By
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Added On
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <LinkIcon className="h-4 w-4 text-primary" />
                          <span>{link.title}</span>
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
                        {link.addedBy}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(link.addedOn).toLocaleDateString()}
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
                                <span>Open Link</span>
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteResource(link.id, "link")
                              }
                            >
                              <Trash className="h-4 w-4 mr-2 text-destructive" />
                              <span className="text-destructive">Delete</span>
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
                  No links found matching your search
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedResources;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskValidators,
  TaskFormValues,
  TaskResource,
} from "@/lib/validation/task";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTask } from "@/lib/api/tasks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TaskType } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sampleTasks } from "@/lib/taskService";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";

interface EditTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskType | null;
}

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const EditTaskSheet: React.FC<EditTaskSheetProps> = ({
  open,
  onOpenChange,
  task,
}) => {
  if (!task) return null;

  const locale = useLocale() as "en" | "fr";
  const t = useTranslations("tasks.toolbar.create.manual");
  const [tagInput, setTagInput] = React.useState("");
  const [resourceName, setResourceName] = React.useState("");
  const [resourceType, setResourceType] = React.useState("");
  const [openProjectCombobox, setOpenProjectCombobox] = useState(false);
  const [resourceCategory, setResourceCategory] = React.useState<
    "file" | "link" | "note"
  >("link");
  const [resourceUrl, setResourceUrl] = React.useState("");
  const [editingResourceId, setEditingResourceId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  // State for parent task and assignees
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);
  const [searchTaskValue, setSearchTaskValue] = useState("");
  const [openTaskCombobox, setOpenTaskCombobox] = useState(false);
  const [openAssignCombobox, setOpenAssignCombobox] = useState(false);
  const [searchProjectValue, setSearchProjectValue] = useState("");

  const tValidation = useTranslations();
  const { taskSchema } = createTaskValidators(tValidation);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      category: task.category || "",
      scheduled: task.scheduled || false,
      date: task.date ? new Date(task.date) : null,
      startTime: task.startTime ? new Date(task.startTime) : null,
      endTime: task.endTime ? new Date(task.endTime) : null,
      tags: task.tags || [],
      assignedTo: task.assignedTo?.map((user) => user.id) || [],
      resources: task.resources || [],
      parentId: task.parentId || null, // Explicitly set null when parentId is falsy
      duration: task.duration || 0,
      projectId: task.projectId || null || undefined,
    },
  });

  // Reset form values when task changes
  useEffect(() => {
    if (task && open) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        category: task.category || "",
        scheduled: task.scheduled || false,
        date: task.date ? new Date(task.date) : null,
        startTime: task.startTime ? new Date(task.startTime) : null,
        endTime: task.endTime ? new Date(task.endTime) : null,
        tags: task.tags || [],
        assignedTo: task.assignedTo?.map((user) => user.id) || [],
        resources: task.resources || [],
        parentId: task.parentId || null, // Explicitly set null when parentId is falsy
        duration: task.duration || null, // Use null instead of 0
        projectId: task.projectId || null || undefined,
      });
    }
  }, [task, open, form]);

  // Watch values from the form
  const isScheduled = form.watch("scheduled");
  const tags = form.watch("tags") || [];
  const resources = form.watch("resources") || [];
  const assignedTo = form.watch("assignedTo") || [];
  const parentId = form.watch("parentId");
  const projectId = form.watch("projectId");

  const { data: projects, isLoading } = useProjects({
    search: searchProjectValue || "",
  });

  // Fetch tasks and team members when the sheet opens
  useEffect(() => {
    if (open) {
      loadTasks();
      loadTeamMembers();
    }
  }, [open]);

  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true);
      // Filter out the current task to avoid setting itself as parent
      const tasksData = sampleTasks.filter((t) => t.id !== task.id);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      setIsLoadingTeamMembers(true);
      // In a real application, this would be an API call to fetch team members
      // For now, we'll derive from the assigned users if any
      const members = task.assignedTo
        ? task.assignedTo.map((user) => ({
            id: user.id,
            name: user.name,
            email: `${user.name
              .toLowerCase()
              .replace(/\s+/g, ".")}@example.com`,
            avatar: user.profilePic,
          }))
        : [];
      setTeamMembers(members);
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setIsLoadingTeamMembers(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const handleAddResource = () => {
    if (resourceName.trim() && resourceCategory) {
      // Validate URL for link resources
      if (resourceCategory === "link" && !resourceUrl.trim()) {
        toast({
          title: t("details.resourcesUrlRequired"),
          description: t("details.resourcesUrlRequired"),
          variant: "destructive",
        });
        return;
      }

      if (editingResourceId) {
        // Update existing resource
        const updatedResources = resources.map((resource) =>
          resource.id === editingResourceId
            ? {
                ...resource,
                name: resourceName.trim(),
                type: resourceType.trim() || "General",
                category: resourceCategory,
                url: resourceUrl.trim() || undefined,
              }
            : resource
        );
        form.setValue("resources", updatedResources);
        setEditingResourceId(null);
      } else {
        // Add new resource
        const newResource: TaskResource = {
          id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: resourceName.trim(),
          type: resourceType.trim() || "General",
          category: resourceCategory,
          url: resourceUrl.trim() || undefined,
        };
        form.setValue("resources", [...resources, newResource]);
      }

      // Reset form fields after adding
      setResourceName("");
      setResourceType("");
      setResourceUrl("");
      setResourceCategory("link");
    }
  };

  const handleEditResource = (resource: TaskResource) => {
    setResourceName(resource.name);
    setResourceType(resource.type || "");
    setResourceCategory(resource.category);
    setResourceUrl(resource.url || "");
    setEditingResourceId(resource.id || null);
  };

  const handleCancelEditResource = () => {
    setResourceName("");
    setResourceType("");
    setResourceUrl("");
    setResourceCategory("link");
    setEditingResourceId(null);
  };

  const handleRemoveResource = (id: string) => {
    form.setValue(
      "resources",
      resources.filter((r) => r.id !== id)
    );
  };

  const handleToggleAssignee = (userId: string) => {
    const currentAssignees = [...assignedTo];
    const index = currentAssignees.indexOf(userId);

    if (index === -1) {
      form.setValue("assignedTo", [...currentAssignees, userId]);
    } else {
      currentAssignees.splice(index, 1);
      form.setValue("assignedTo", currentAssignees);
    }
  };

  const filteredTasks = searchTaskValue
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTaskValue.toLowerCase()) ||
          (task.description &&
            task.description
              .toLowerCase()
              .includes(searchTaskValue.toLowerCase()))
      )
    : tasks;

  const selectedTask = tasks.find((t) => t.id === parentId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast({
        title: t("toast.updateSuccess.title"),
        description: t("toast.updateSuccess.description"),
      });
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "all" }),
        queryClient.refetchQueries({
          queryKey: ["project", task.projectId],
          type: "all",
        }),
        queryClient.refetchQueries({
          queryKey: ["calendar-tasks"],
          type: "active",
        }),
      ]).then(() => {
        setTimeout(() => onOpenChange(false), 100);
      });
    },
    onError: (error) => {
      toast({
        title: t("toast.updateError.title"),
        description: t("toast.updateError.description"),
        variant: "destructive",
      });
      console.error("Error updating task: ", error);
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    console.log("Form submitted with values:", values);
    const isScheduled = values.startTime && values.endTime && values.duration;
    mutate({
      taskId: task.id,
      taskData: {
        category: values.category || "",
        completed: false,
        description: values.description,
        duration: values.duration || null, // Use null instead of undefined
        endTime: values.endTime || null,
        parentId: values.parentId || null, // Ensure null is explicitly set when parentId is undefined
        priority: values.priority,
        // Ensure each resource has a defined id
        resources: values.resources.map((resource) => ({
          ...resource,
          id: resource.id || Date.now().toString(),
        })),
        scheduled: isScheduled ? values.scheduled : false,
        startTime: values.startTime || null,
        tags: values.tags,
        title: values.title,
        projectId: projectId || undefined,
        assignedTo: values.assignedTo.map((userId) => {
          const member = teamMembers.find((m) => m.id === userId);
          return {
            id: userId,
            name: member?.name || "Unknown",
            profilePic: member?.avatar,
          };
        }),
        date: values.date || null,
        order: 0,
        status: values.scheduled ? "todo" : "unscheduled",
        id: task.id,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg border-l">
        <SheetHeader className="pb-4">
          <SheetTitle>{t("editTitle")}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">{t("basicInfo.title")}</TabsTrigger>
                <TabsTrigger value="schedule">
                  {t("schedule.title")}
                </TabsTrigger>
                <TabsTrigger value="details">{t("details.title")}</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-250px)] pr-3">
                <div className="p-1">
                  <TabsContent value="basic" className="space-y-6 mt-0">
                    {/* Basic fields */}
                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("basicInfo.projectLabel")}</FormLabel>
                          <Popover
                            open={openProjectCombobox}
                            onOpenChange={setOpenProjectCombobox}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  onClick={() =>
                                    setOpenProjectCombobox(!openProjectCombobox)
                                  }
                                >
                                  {isLoading ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>
                                        {t("basicInfo.loadingProjects")}
                                      </span>
                                    </div>
                                  ) : field.value && projects ? (
                                    <div className="flex items-center gap-2 truncate">
                                      <span className="truncate">
                                        {projects.find(
                                          (p) => p.id === field.value
                                        )?.name || t("basicInfo.selectProject")}
                                      </span>
                                    </div>
                                  ) : (
                                    t("basicInfo.selectProject")
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                              <Command>
                                <CommandInput
                                  placeholder={t(
                                    "basicInfo.projectPlaceholder"
                                  )}
                                  value={searchProjectValue}
                                  onValueChange={setSearchProjectValue}
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {t("basicInfo.noProjectsFound")}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {projects?.map((project) => (
                                      <CommandItem
                                        key={project.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "projectId",
                                            project.id
                                          );
                                          setOpenProjectCombobox(false);
                                          setSearchProjectValue("");
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="truncate">
                                          {project.name}
                                        </span>
                                        {field.value === project.id && (
                                          <Check className="ml-auto h-4 w-4" />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            {t("basicInfo.projectDescription")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("basicInfo.titleLabel")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("basicInfo.titlePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("basicInfo.descriptionLabel")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "basicInfo.descriptionPlaceholder"
                              )}
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("basicInfo.priorityLabel")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "basicInfo.priorityPlaceholder"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">
                                {t("basicInfo.priorityOptions.high")}
                              </SelectItem>
                              <SelectItem value="medium">
                                {t("basicInfo.priorityOptions.medium")}
                              </SelectItem>
                              <SelectItem value="low">
                                {t("basicInfo.priorityOptions.low")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("basicInfo.categoryLabel")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("basicInfo.categoryPlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="schedule" className="space-y-6 mt-0">
                    {/* Schedule fields */}
                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="scheduled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {t("schedule.subTitle")}
                            </FormLabel>
                            <FormDescription>
                              {t("schedule.description")}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {isScheduled && (
                      <>
                        <FormField
                          control={form.control}
                          disabled={isPending}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>{t("schedule.dateLabel")}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>
                                          {t("schedule.datePlaceholder")}
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    variant="compact"
                                    selected={field.value as Date}
                                    onSelect={field.onChange}
                                    initialFocus
                                    locale={locale == "fr" ? fr : enUS}
                                    lang={locale}
                                    disabled={isPending}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            disabled={isPending}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("schedule.startTimeLabel")}
                                </FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      type="time"
                                      onChange={(e) => {
                                        const date = field.value || new Date();
                                        const [hours, minutes] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        date.setHours(hours, minutes);
                                        field.onChange(date);
                                      }}
                                      value={
                                        field.value
                                          ? `${String(
                                              field.value.getHours()
                                            ).padStart(2, "0")}:${String(
                                              field.value.getMinutes()
                                            ).padStart(2, "0")}`
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            disabled={isPending}
                            name="endTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t("schedule.endTimeLabel")}
                                </FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      type="time"
                                      onChange={(e) => {
                                        const date = field.value || new Date();
                                        const [hours, minutes] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        date.setHours(hours, minutes);
                                        field.onChange(date);
                                      }}
                                      value={
                                        field.value
                                          ? `${String(
                                              field.value.getHours()
                                            ).padStart(2, "0")}:${String(
                                              field.value.getMinutes()
                                            ).padStart(2, "0")}`
                                          : ""
                                      }
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          disabled={isPending}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t("schedule.durationLabel")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={t(
                                    "schedule.durationPlaceholder"
                                  )}
                                  min={5}
                                  {...field}
                                  value={
                                    field.value === null ? "" : field.value
                                  }
                                  onChange={(e) => {
                                    const value =
                                      e.target.value === ""
                                        ? null
                                        : Number(e.target.value);
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                {t("schedule.durationDescription")}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6 mt-0">
                    {/* Tags Field */}
                    <div>
                      <FormLabel>{t("details.tagsLabel")}</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder={t("details.tagsPlaceholder")}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddTag}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Parent Task Field */}
                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="parentId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("details.parentTaskLabel")}</FormLabel>
                          <Popover
                            open={openTaskCombobox}
                            onOpenChange={setOpenTaskCombobox}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  onClick={() =>
                                    setOpenTaskCombobox(!openTaskCombobox)
                                  }
                                >
                                  {isLoadingTasks ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>{t("details.loadingTasks")}</span>
                                    </div>
                                  ) : field.value && selectedTask ? (
                                    <div className="flex items-center gap-2 truncate">
                                      <span className="truncate">
                                        {selectedTask.title}
                                      </span>
                                    </div>
                                  ) : (
                                    t("details.selectParentTask")
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                              <Command>
                                <CommandInput
                                  placeholder={t(
                                    "details.parentTaskPlaceholder"
                                  )}
                                  value={searchTaskValue}
                                  onValueChange={setSearchTaskValue}
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {t("details.noTasksFound")}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    <CommandItem
                                      onSelect={() => {
                                        form.setValue("parentId", undefined);
                                        setOpenTaskCombobox(false);
                                        setSearchTaskValue("");
                                      }}
                                      className="text-muted-foreground"
                                    >
                                      {t("details.noTasks")}
                                    </CommandItem>
                                    {filteredTasks.map((task) => (
                                      <CommandItem
                                        key={task.id}
                                        onSelect={() => {
                                          form.setValue("parentId", task.id);
                                          setOpenTaskCombobox(false);
                                          setSearchTaskValue("");
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <div
                                          className={cn(
                                            "w-2 h-2 rounded-full",
                                            task.priority === "high"
                                              ? "bg-destructive"
                                              : task.priority === "medium"
                                              ? "bg-amber-500"
                                              : "bg-emerald-500"
                                          )}
                                        />
                                        <span className="truncate">
                                          {task.title}
                                        </span>
                                        {field.value === task.id && (
                                          <Check className="ml-auto h-4 w-4" />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            {t("details.parentTaskDescription")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Assigned To */}
                    <FormField
                      control={form.control}
                      disabled={isPending}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("details.assignToLabel")}</FormLabel>
                          <Popover
                            open={openAssignCombobox}
                            onOpenChange={setOpenAssignCombobox}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value?.length &&
                                      "text-muted-foreground"
                                  )}
                                  onClick={() =>
                                    setOpenAssignCombobox(!openAssignCombobox)
                                  }
                                >
                                  {isLoadingTeamMembers ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>{t("details.loadingTeam")}</span>
                                    </div>
                                  ) : field.value?.length ? (
                                    <div className="flex flex-wrap gap-1 mr-2">
                                      {field.value.length > 2 ? (
                                        <span>
                                          {t("details.peopleAssigned", {
                                            count: field.value.length,
                                          })}
                                        </span>
                                      ) : (
                                        field.value.map((userId) => {
                                          const member = teamMembers.find(
                                            (m) => m.id === userId
                                          );
                                          return member ? (
                                            <Badge
                                              key={userId}
                                              variant="secondary"
                                              className="gap-1"
                                            >
                                              {member.name}
                                            </Badge>
                                          ) : null;
                                        })
                                      )}
                                    </div>
                                  ) : (
                                    t("details.assignToDescription")
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                              <Command>
                                <CommandInput
                                  placeholder={t("details.assignToPlaceholder")}
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {t("details.noTeamMembers")}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {teamMembers.map((member) => (
                                      <CommandItem
                                        key={member.id}
                                        onSelect={() =>
                                          handleToggleAssignee(member.id)
                                        }
                                        className="flex items-center gap-2"
                                      >
                                        <Avatar className="h-6 w-6">
                                          {member.avatar && (
                                            <AvatarImage
                                              src={member.avatar}
                                              alt={member.name}
                                            />
                                          )}
                                          <AvatarFallback>
                                            {getInitials(member.name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>{member.name}</span>
                                        <div className="ml-auto">
                                          <Checkbox
                                            checked={field.value?.includes(
                                              member.id
                                            )}
                                            onCheckedChange={() =>
                                              handleToggleAssignee(member.id)
                                            }
                                            aria-label={`Select ${member.name}`}
                                          />
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                                {assignedTo.length > 0 && (
                                  <div className="border-t p-2">
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-sm"
                                      onClick={() =>
                                        form.setValue("assignedTo", [])
                                      }
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      {t("details.clearAll")}
                                    </Button>
                                  </div>
                                )}
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            {t("details.assignToDescription")}
                          </FormDescription>
                          {assignedTo.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {assignedTo.map((userId) => {
                                const member = teamMembers.find(
                                  (m) => m.id === userId
                                );
                                return member ? (
                                  <Badge
                                    key={userId}
                                    variant="secondary"
                                    className="gap-1"
                                  >
                                    {member.name}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleToggleAssignee(userId)
                                      }
                                      className="ml-1 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Resources section - Enhanced for editing existing resources */}
                    <div className="space-y-3">
                      <FormLabel>{t("details.resourcesLabel")}</FormLabel>
                      <div className="space-y-2">
                        {resources.length > 0 && (
                          <div className="space-y-2">
                            {resources.map((resource) => (
                              <div
                                key={resource.id}
                                className="flex items-center justify-between p-2 border rounded-md"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {resource.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {resource.category} •{" "}
                                    {resource.type || "General"}
                                    {resource.url && (
                                      <span className="ml-1">
                                        •{" "}
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {resource.url.length > 30
                                            ? `${resource.url.substring(
                                                0,
                                                30
                                              )}...`
                                            : resource.url}
                                        </a>
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditResource(resource)}
                                    aria-label={`Edit resource ${resource.name}`}
                                    disabled={editingResourceId !== null}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-pencil"
                                    >
                                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                      <path d="m15 5 4 4" />
                                    </svg>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveResource(resource.id!)
                                    }
                                    aria-label={`Remove resource ${resource.name}`}
                                    disabled={editingResourceId === resource.id}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2 border rounded-md p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">
                              {editingResourceId
                                ? t("details.editResource")
                                : resources.length
                                ? t("details.addNewResource")
                                : t("details.addResource")}
                            </h4>
                            {editingResourceId && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEditResource}
                              >
                                <X className="h-4 w-4 mr-1" />
                                {t("details.cancelEdit")}
                              </Button>
                            )}
                          </div>

                          <FormItem>
                            <FormLabel>
                              {t("details.resourcesNameLabel")}
                            </FormLabel>
                            <Input
                              placeholder={t(
                                "details.resourcesNamePlaceHolder"
                              )}
                              value={resourceName}
                              onChange={(e) => setResourceName(e.target.value)}
                            />
                            {!resourceName.trim() && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("details.resourcesNameRequired")}
                              </p>
                            )}
                          </FormItem>

                          <div className="grid grid-cols-2 gap-2">
                            <FormItem>
                              <FormLabel>
                                {t("details.resourcesTypeLabel")}
                              </FormLabel>
                              <Input
                                placeholder={t(
                                  "details.resourcesTypePlaceHolder"
                                )}
                                value={resourceType}
                                onChange={(e) =>
                                  setResourceType(e.target.value)
                                }
                              />
                            </FormItem>

                            <FormItem>
                              <FormLabel>
                                {t("details.resourcesCategoryLabel")}
                              </FormLabel>
                              <Select
                                value={resourceCategory}
                                onValueChange={(
                                  value: "file" | "link" | "note"
                                ) => {
                                  setResourceCategory(value);
                                  // Clear URL if changing from link to something else
                                  if (value !== "link") {
                                    setResourceUrl("");
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "details.resourcesCategoryPlaceHolder"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="file">
                                    {t("details.file")}
                                  </SelectItem>
                                  <SelectItem value="link">
                                    {t("details.link")}
                                  </SelectItem>
                                  <SelectItem value="note">
                                    {t("details.note")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          </div>

                          <FormItem>
                            <FormLabel>
                              {t("details.resourcesUrlLabel")}
                              {resourceCategory === "link" && "*"}
                            </FormLabel>
                            <Input
                              placeholder={t("details.resourcesUrlPlaceholder")}
                              value={resourceUrl}
                              onChange={(e) => setResourceUrl(e.target.value)}
                              disabled={resourceCategory !== "link"}
                            />
                            {resourceCategory === "link" && !resourceUrl && (
                              <div className="text-xs text-red-500 mt-1">
                                {t("details.resourcesUrlRequired")}
                              </div>
                            )}
                          </FormItem>

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={handleAddResource}
                            disabled={
                              !resourceName.trim() ||
                              !resourceCategory ||
                              (resourceCategory === "link" &&
                                !resourceUrl.trim())
                            }
                          >
                            {editingResourceId ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-check mr-2"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {t("details.updateResource")}
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                {resources.length
                                  ? t("details.addNewResource")
                                  : t("details.addResource")}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* ...existing code... */}
                  </TabsContent>

                  {/* ...existing code... */}
                </div>
              </ScrollArea>
            </Tabs>

            <SheetFooter className="pt-6 border-t mt-6">
              <SheetClose asChild>
                <Button variant="outline" type="button">
                  {t("cancel")}
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending} className="gap-1">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("updating")}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {t("update")}
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditTaskSheet;

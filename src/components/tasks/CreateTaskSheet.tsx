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
import { format, set } from "date-fns";
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
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { createManualTask } from "@/lib/api/tasks";
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
interface CreateTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  teamId?: string;
  orgId?: string;
}

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
};

const CreateTaskSheet: React.FC<CreateTaskSheetProps> = ({
  open,
  teamId,
  onOpenChange,
  projectId,
  orgId,
}) => {
  const locale = useLocale() as "en" | "fr";
  const t = useTranslations("tasks.toolbar.create.manual");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");
  const [resourceName, setResourceName] = React.useState("");
  const [resourceType, setResourceType] = React.useState("");
  const [resourceCategory, setResourceCategory] = useState<
    "file" | "link" | "note"
  >("link");
  const [resourceUrl, setResourceUrl] = React.useState("");
  // State for parent task and assignees
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);
  const [searchTaskValue, setSearchTaskValue] = useState("");
  const [openTaskCombobox, setOpenTaskCombobox] = useState(false);
  const [openAssignCombobox, setOpenAssignCombobox] = useState(false);
  const [searchProjectValue, setSearchProjectValue] = useState("");
  const [openProjectCombobox, setOpenProjectCombobox] = useState(false);

  const queryClient = useQueryClient();

  const tValidation = useTranslations();
  const { taskSchema } = createTaskValidators(tValidation); // Set default values for the form - explicitly include projectId from props
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "",
      scheduled: false,
      date: null,
      startTime: null,
      endTime: null,
      tags: [],
      assignedTo: [],
      resources: [],
      parentId: undefined,
      teamId: teamId || undefined, // Explicitly set the teamId from props
      projectId: projectId || undefined, // Explicitly set the projectId from props
    },
  }); // Fetch projects data with a single query
  const { data: projects, isLoading } = useProjects({
    search: searchProjectValue || "",
  });

  // Simple direct approach: Set projectId on component mount
  useEffect(() => {
    if (projectId) {
      console.log("Setting projectId:", projectId);
      form.setValue("projectId", projectId);
    }
  }, [projectId, form]);

  // Watch values from the form
  const isScheduled = form.watch("scheduled");
  const tags = form.watch("tags") || [];
  const resources = form.watch("resources") || [];
  const assignedTo = form.watch("assignedTo") || [];
  const parentId = form.watch("parentId");
  const selectedProjectId = form.watch("projectId");
  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true);
      const tasksData = sampleTasks; // Replace with your API call to fetch tasks
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };
  // Fetch tasks and team members when the sheet opens
  useEffect(() => {
    if (open) {
      loadTasks();
      loadTeamMembers();
    }
  }, [open]);
  const loadTeamMembers = async () => {
    try {
      setIsLoadingTeamMembers(true);
      const members = [] as TeamMember[]; // Replace with your API call to fetch team members
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
      const newResource: TaskResource = {
        id: Date.now().toString(),
        name: resourceName.trim(),
        type: resourceType.trim(),
        category: resourceCategory,
        ...(resourceUrl.trim() ? { url: resourceUrl.trim() } : {}),
      };
      form.setValue("resources", [...resources, newResource]);
      setResourceName("");
      setResourceType("");
      setResourceUrl("");
    }
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
  const selectedTask = tasks.find((task) => task.id === parentId);

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
    mutationFn: createManualTask,
    onSuccess: () => {
      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description"),
      });
      form.reset();
      Promise.all([
        queryClient.refetchQueries({ queryKey: ["tasks"], type: "active" }),
        queryClient.refetchQueries({
          queryKey: ["project", projectId],
          type: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["tasks-by-date"],
        }),
        queryClient.refetchQueries({
          queryKey: ["team"],
          type: "all",
        }),
      ]).then(() => {
        setTimeout(() => onOpenChange(false), 100);
      });
    },
    onError: (error) => {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.description") + " " + error.message,
        variant: "destructive",
      });
      console.error("Error creating task: ", error);
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const isScheduled = values.startTime && values.endTime && values.duration;
      mutate({
        category: values.category || "",
        completed: false,
        description: values.description,
        duration: values.duration || 0,
        endTime: values.endTime || null,
        parentId: values.parentId || null,
        teamId: teamId || undefined,
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
        projectId: selectedProjectId || undefined,
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
        id: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg border-l">
        <SheetHeader className="pb-4">
          <SheetTitle>{t("title")}</SheetTitle>
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
                    {/* Schedule fields - unchanged */}
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
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value)
                                    )
                                  }
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  disabled={field.disabled}
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

                    {/* Parent Task Field - Now enabled */}
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

                    {/* Assigned To - Now enabled */}
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
                                          {t("peopleAssigned", {
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

                    {/* Resources section */}
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
                                <div>
                                  <p className="font-medium">{resource.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {resource.category} • {resource.type}
                                    {resource.url && ` • ${resource.url}`}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveResource(resource.id!)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2 border rounded-md p-3">
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
                                ) => setResourceCategory(value)}
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
                            />
                            {resourceCategory === "link" && !resourceUrl && (
                              <div className="text-xs text-red-500 mt-1">
                                {t("details.resourcesUrlDescription")}
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
                            <Plus className="h-4 w-4 mr-2" />
                            {t("details.addResource")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
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
                    {t("creating")}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {t("create")}
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

export default CreateTaskSheet;

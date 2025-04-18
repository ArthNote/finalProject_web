"use client";

import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project, UpdateProjectData } from "@/types/project";
import { enUS, fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const [isPending, setIsPending] = React.useState(false);
  const t = useTranslations("Projects.create");
  const locale = useLocale() as "en" | "fr";
  const { updateProject, useProject } = useProjects();
  const queryClient = useQueryClient();
  const formSchema = z.object({
    name: z.string().min(1, t("projectNameRequired")).max(100),
    description: z.string().max(500),
    status: z.enum(["not-started", "active", "on-hold", "completed"]),
    priority: z.enum(["low", "medium", "high"]),
    progress: z.number().min(0).max(100),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      status: project.status as
        | "not-started"
        | "active"
        | "on-hold"
        | "completed",
      priority: project.priority as "low" | "medium" | "high",
      progress: project.progress,
      startDate: project.startDate ? new Date(project.startDate) : undefined,
      endDate: project.endDate ? new Date(project.endDate) : undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsPending(true);
      updateProject({
        id: project.id,
        data: data as UpdateProjectData,
      });
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["projects"], type: "all" });
      queryClient.refetchQueries({ queryKey: ["projects"], type: "all" });
      queryClient.invalidateQueries({
        queryKey: ["project", project.id],
        type: "all",
      });
      queryClient.refetchQueries({
        queryKey: ["project", project.id],
        type: "all",
      });
      toast({
        title: t("toast.updateSuccess.title"),
        description: t("toast.updateSuccess.description"),
      });
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: t("toast.updateError.title"),
        description: t("toast.updateError.description"),
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="p-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Basic form fields */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.name.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.name.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.description.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.description.placeholder")}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.status.label")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="not-started">
                              {t("filters.status.options.not-started")}
                            </SelectItem>
                            <SelectItem value="active">
                              {t("filters.status.options.active")}
                            </SelectItem>
                            <SelectItem value="on-hold">
                              {t("filters.status.options.on-hold")}
                            </SelectItem>
                            <SelectItem value="completed">
                              {t("filters.status.options.completed")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.priority.label")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              {t("filters.priority.options.low")}
                            </SelectItem>
                            <SelectItem value="medium">
                              {t("filters.priority.options.medium")}
                            </SelectItem>
                            <SelectItem value="high">
                              {t("filters.priority.options.high")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("form.startDate.label")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", {
                                    locale: locale === "fr" ? fr : enUS,
                                  })
                                ) : (
                                  <span>{t("pickDate")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              lang={locale}
                              locale={locale === "en" ? enUS : fr}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("form.endDate.label")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", {
                                    locale: locale === "fr" ? fr : enUS,
                                  })
                                ) : (
                                  <span>{t("pickDate")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) =>
                                date <
                                (form.getValues("startDate") || new Date())
                              }
                              lang={locale}
                              locale={locale === "en" ? enUS : fr}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    type="button"
                    disabled={isPending}
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("update")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection = () => {
  const t = useTranslations("HomePage.contact");
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    // Here you would typically send the data to your backend
    console.log(data);
    toast({
      description: "Message sent successfully!",
    });
    form.reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "support",
      contact: "email",
    },
    {
      icon: Building2,
      title: "sales",
      contact: "email",
    },
    {
      icon: Phone,
      title: "phone",
      contact: "number",
    },
  ];

  return (
    <section id="contact" className="container  pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-block">
          {/* <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
            {t("subtitle")}
          </span> */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
            {t("title")}
            <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="name">
                      {t("form.name.label")}
                    </label>
                    <Input
                      id="name"
                      placeholder={t("form.name.placeholder")}
                      {...form.register("name")}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="email">
                      {t("form.email.label")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.email.placeholder")}
                      {...form.register("email")}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="message">
                      {t("form.message.label")}
                    </label>
                    <Textarea
                      id="message"
                      placeholder={t("form.message.placeholder")}
                      className="min-h-[150px]"
                      {...form.register("message")}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {contactInfo.map((info, index) => (
            <Card key={info.title}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-primary/5 rounded-lg">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {t(`info.${info.title}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t(`info.${info.title}.description`)}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      {t(`info.${info.title}.${info.contact}`)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

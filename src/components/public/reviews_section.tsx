"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const UserReviewCard = ({ name, title, message, avatar, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className=""
    >
      <div className="relative rounded-xl border bg-card">
        <div className="flex flex-col px-4 py-5 sm:p-6">
          <div>
            <div className="relative mb-4 flex items-center gap-3">
              <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                <Image
                  width={100}
                  height={100}
                  className="size-full rounded-full border"
                  src={avatar}
                  alt={name}
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>
            <q className="text-muted-foreground">{message}</q>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReviewsSection = () => {
  const t = useTranslations("HomePage.reviews");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const reviews = [
    {
      name: t("reviews.0.name"),
      title: t("reviews.0.title"),
      message: t("reviews.0.message"),
      avatar: "https://i.pravatar.cc/150?img=1",
      gradientClass: "bg-gradient-to-br from-primary/5 to-transparent",
    },
    {
      name: t("reviews.1.name"),
      title: t("reviews.1.title"),
      message: t("reviews.1.message"),
      avatar: "https://i.pravatar.cc/150?img=2",
      gradientClass: "bg-gradient-to-br from-blue-500/5 to-transparent",
    },
    {
      name: t("reviews.2.name"),
      title: t("reviews.2.title"),
      message: t("reviews.2.message"),
      avatar: "https://i.pravatar.cc/150?img=3",
      gradientClass: "bg-gradient-to-br from-green-500/5 to-transparent",
    },
    {
      name: t("reviews.3.name"),
      title: t("reviews.3.title"),
      message: t("reviews.3.message"),
      avatar: "https://i.pravatar.cc/150?img=4",
      gradientClass: "bg-gradient-to-br from-purple-500/5 to-transparent",
    },
  ];

  return (
    <section className="container py-24 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto text-center space-y-4 md:max-w-[58rem]"
      >
        <div className="inline-block">
          <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
            {t("title")}
            <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </motion.div>

      <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
        <AnimatePresence>
          {reviews.map((item, index) => (
            <div className="break-inside-avoid " key={item.name}>
              <motion.div
                animate={{
                  scale: hoveredIndex === index ? 1.02 : 1,
                  zIndex: hoveredIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <UserReviewCard {...item} index={index} />
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ReviewsSection;

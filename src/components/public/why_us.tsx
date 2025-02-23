"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Shield,
  Clock,
  Laptop2,
  Brain,
  Cross,
  ComputerIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
  const t = useTranslations("HomePage");
  return (
    <section id="why-us" className="py-28">
      {/* Header - Similar to features section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative"
      >
        <div className="inline-block">
          <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
            {t("whyUs.subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
            {t("whyUs.title")}
            <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("whyUs.description")}
          </p>
        </div>
      </motion.div>

      <div className="relative z-8 grid grid-cols-6 gap-3 sm:px-0 mt-12">
        {/* First card - User Friendly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative col-span-full flex overflow-hidden rounded-2xl border bg-background p-8 lg:col-span-2"
        >
          {/* Replace SVG with modern interface icon */}
          <div className="relative m-auto text-center size-fit">
            <div className="relative flex h-24 w-56 m-auto items-center">
              <svg
                className="absolute inset-0 size-full text-primary/30"
                viewBox="0 0 254 104"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-gradient_indigo-purple mx-auto block w-fit font-heading text-5xl">
                100%
              </span>
            </div>
            <h2 className="text-2xl font-semibold mt-2">
              {t("whyUs.features.userFriendly.title")}
            </h2>
          </div>
        </motion.div>

        {/* Second card - Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative col-span-full overflow-hidden rounded-2xl border bg-background p-8 sm:col-span-3 lg:col-span-2"
        >
          <div className="text-center">
            <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border before:bg-muted/20 dark:before:border-white/5">
              <svg
                className="m-auto h-fit w-24 "
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Shield Base */}
                <path
                  className="text-primary/30"
                  d="M12 2L4 5.4V11.4C4 16.4 7.6 21 12 22C16.4 21 20 16.4 20 11.4V5.4L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Checkmark */}
                <path
                  className="text-primary"
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Circular Protection Ring */}
                <circle
                  className="text-primary/20"
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Security Pulses */}
                <circle
                  className="text-primary/10"
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mt-4">
              {t("whyUs.features.secure.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("whyUs.features.secure.description")}
            </p>
          </div>
        </motion.div>

        {/* Third card - Real Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative col-span-full overflow-hidden rounded-2xl border bg-background p-8 sm:col-span-3 lg:col-span-2"
        >
          <div className="text-center">
            <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border before:bg-muted/20 dark:before:border-white/5">
              <svg
                className="m-auto h-fit w-24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer circle with pulse animation */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="text-primary/30"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="r"
                    values="43;45;43"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Clock markers */}
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    transform={`rotate(${i * 30} 50 50)`}
                    className="text-primary/50"
                  />
                ))}
                {/* Hour hand with rotation */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="25"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </line>
                {/* Minute hand with faster rotation */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </line>
                {/* Center dot with pulse */}
                <circle
                  cx="50"
                  cy="50"
                  r="3"
                  className="text-primary"
                  fill="currentColor"
                >
                  <animate
                    attributeName="r"
                    values="2;3;2"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Rotating speed lines */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                  <path
                    d="M85 50C85 69.33 69.33 85 50 85"
                    className="text-primary"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M50 15C69.33 15 85 30.67 85 50"
                    className="text-primary/30"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                </g>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mt-4">
              {t("whyUs.features.realTime.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("whyUs.features.realTime.description")}
            </p>
          </div>
        </motion.div>

        {/* Second row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative col-span-full overflow-hidden rounded-2xl border bg-background p-8 lg:col-span-3"
        >
          <div className="grid sm:grid-cols-2">
            <div className="relative z-8 flex flex-col space-y-6">
              <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10">
                <ComputerIcon className="m-auto size-5 stroke-1" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">
                  {t("whyUs.features.accessible.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("whyUs.features.accessible.description")}
                </p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative -mb-10 -mr-10 mt-8 h-fit rounded-tl-xl border bg-muted/30 pt-6 sm:ml-6 sm:mt-auto"
            >
              <div className="absolute left-3 top-2 flex gap-1">
                <span className="block size-2 rounded-full border border-border"></span>
                <span className="block size-2 rounded-full border border-border"></span>
                <span className="block size-2 rounded-full border border-border"></span>
              </div>
              <div className="relative flex h-48 w-24 items-center justify-center rounded-lg border bg-muted/50 border-primary/50 -rotate-6 -translate-x-1 transition-transform duration-300 hover:translate-x-2 hover:-rotate-3">
                <div className="absolute top-1 left-1 h-2 w-8 rounded-full bg-muted dark:bg-muted/80 border border-primary/50"></div>
                <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-muted dark:bg-muted/80 border border-primary/50"></div>
                <div className="h-full w-full"></div>
              </div>
              <div className="relative flex h-36 w-60 items-center justify-center rounded-lg border bg-muted/50 border-primary/50 rotate-6 translate-x-9 -mt-16 transition-transform duration-300 hover:translate-x-12 hover:rotate-3">
                <div className="absolute top-1 left-1 h-2 w-8 rounded-full bg-muted dark:bg-muted/80 border border-primary/50"></div>
                <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-muted dark:bg-muted/80 border border-primary/50"></div>
                <div className="h-full w-full"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative col-span-full overflow-hidden rounded-2xl border bg-background p-8 lg:col-span-3"
        >
          <div className="grid h-full sm:grid-cols-2">
            <div className="relative z-8 flex flex-col justify-between space-y-12 lg:space-y-6">
              <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:bg-white/5 dark:before:border-white/5 dark:before:bg-white/5">
                <Brain className="m-auto size-5 stroke-1" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-foreground">
                  {t("whyUs.features.comprehensive.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("whyUs.features.comprehensive.description")}
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative mt-6 sm:-my-8 sm:-mr-8"
            >
              <div className="relative h-[300px] w-full">
                {/* Hexagonal Grid Pattern */}
                <div className="absolute inset-0 grid grid-cols-4 gap-4 opacity-20">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border border-primary/30 bg-primary/5"
                      style={{
                        transform: `rotate(${i * 5}deg)`,
                        animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>

                {/* Central Element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative size-40">
                    {/* Geometric Shapes */}
                    <div className="absolute inset-0 rounded-lg border-2 border-primary/20 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-4 rotate-45 rounded-lg border-2 border-primary/30 animate-[spin_8s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 rounded-full border-2 border-primary/40" />

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="size-12 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Floating Dots */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute size-1 rounded-full bg-primary/60"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animation: `float 3s ease-in-out infinite`,
                        animationDelay: `${i * 0.25}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

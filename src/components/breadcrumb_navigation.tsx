"use client";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const BreadcrumbNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations("breadcrumb");

  // Define paths to exclude from breadcrumb display
  const excludePaths = ["en", "fr"];

  // Extract path segments and filter out excluded paths and locales
  const allSegments = pathname.split("/").filter(Boolean);
  const displaySegments = allSegments.filter(
    (segment) => !excludePaths.includes(segment)
  );

  const buildHref = (segment: string) => {
    const segmentIndex = allSegments.indexOf(segment);
    // Include locale in href but not in display
    const locale =
      allSegments[0] === "en" || allSegments[0] === "fr"
        ? allSegments[0]
        : "en";
    return `/${allSegments.slice(1, segmentIndex + 1).join("/")}`;
  };

  // Function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, " ");
  };

  // Function to translate and capitalize segment
  const translateSegment = (segment: string) => {
    try {
      return t(`segments.${segment}`);
    } catch {
      // Fallback to capitalize if no translation exists
      return capitalizeFirstLetter(segment);
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displaySegments.map((segment, index) => {
          const isLast = index === displaySegments.length - 1;
          const href = buildHref(segment);

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{translateSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {translateSegment(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavigation;

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

  // Function to check if a segment is an ID
  const isId = (segment: string) => {
    // Check for numeric IDs, UUID format, or name-like identifiers
    return (
      /^\d+$/.test(segment) || // Numeric IDs
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment
      ) || // UUID format
      /^[a-z0-9]+-[a-z0-9-]+$/i.test(segment) || // Slug format (e.g., user-john-doe)
      /^[a-z0-9]{8,}$/i.test(segment) // Alphanumeric ID of 8+ chars
    );
  };

  // Function to translate and capitalize segment
  const translateSegment = (segment: string) => {
    // If the segment is an ID, return it as-is
    if (isId(segment)) {
      return segment;
    }

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

"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const TermsPage = () => {
  const locale = useLocale();
  const t = useTranslations("Terms");

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Card className="p-6">
        <CardContent className="p-0">
          <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
          <p className="mb-6 text-muted-foreground">
            {t("lastUpdated", { date: "May 6, 2025" })}
          </p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.introduction.title")}
              </h2>
              <p>{t("sections.introduction.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.definitions.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>
                    {t("sections.definitions.terms.service.term")}
                  </strong>{" "}
                  {t("sections.definitions.terms.service.definition")}
                </li>
                <li>
                  <strong>{t("sections.definitions.terms.user.term")}</strong>{" "}
                  {t("sections.definitions.terms.user.definition")}
                </li>
                <li>
                  <strong>{t("sections.definitions.terms.terms.term")}</strong>{" "}
                  {t("sections.definitions.terms.terms.definition")}
                </li>
                <li>
                  <strong>
                    {t("sections.definitions.terms.content.term")}
                  </strong>{" "}
                  {t("sections.definitions.terms.content.definition")}
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.userAccounts.title")}
              </h2>
              <p>{t("sections.userAccounts.content.registration")}</p>
              <p>{t("sections.userAccounts.content.responsibility")}</p>
              <p>{t("sections.userAccounts.content.termination")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.intellectualProperty.title")}
              </h2>
              <p>{t("sections.intellectualProperty.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.userContent.title")}
              </h2>
              <p>{t("sections.userContent.content.ownership")}</p>
              <p>{t("sections.userContent.content.license")}</p>
              <p>{t("sections.userContent.content.prohibited")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.prohibitedActivities.title")}
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.prohibitedActivities.items.illegal")}</li>
                <li>
                  {t("sections.prohibitedActivities.items.impersonation")}
                </li>
                <li>{t("sections.prohibitedActivities.items.harmful")}</li>
                <li>{t("sections.prohibitedActivities.items.spam")}</li>
                <li>{t("sections.prohibitedActivities.items.security")}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.privacy.title")}
              </h2>
              <p>{t("sections.privacy.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.termination.title")}
              </h2>
              <p>{t("sections.termination.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.limitation.title")}
              </h2>
              <p>{t("sections.limitation.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.changes.title")}
              </h2>
              <p>{t("sections.changes.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.contact.title")}
              </h2>
              <p>{t("sections.contact.content")}</p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;

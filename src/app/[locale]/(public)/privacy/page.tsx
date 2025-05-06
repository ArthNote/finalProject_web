"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPage = () => {
  const locale = useLocale();
  const t = useTranslations("Privacy");

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
                {t("sections.information.title")}
              </h2>
              <p>{t("sections.information.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.information.items.personal")}</li>
                <li>{t("sections.information.items.usage")}</li>
                <li>{t("sections.information.items.device")}</li>
                <li>{t("sections.information.items.cookies")}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.dataUsage.title")}
              </h2>
              <p>{t("sections.dataUsage.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.dataUsage.purposes.serviceProvision")}</li>
                <li>{t("sections.dataUsage.purposes.improvement")}</li>
                <li>{t("sections.dataUsage.purposes.communication")}</li>
                <li>{t("sections.dataUsage.purposes.security")}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.dataSharing.title")}
              </h2>
              <p>{t("sections.dataSharing.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.dataSharing.parties.serviceProviders")}</li>
                <li>{t("sections.dataSharing.parties.legal")}</li>
                <li>{t("sections.dataSharing.parties.business")}</li>
                <li>{t("sections.dataSharing.parties.consent")}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.cookies.title")}
              </h2>
              <p>{t("sections.cookies.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>{t("sections.cookies.types.essential.name")}</strong>:{" "}
                  {t("sections.cookies.types.essential.description")}
                </li>
                <li>
                  <strong>{t("sections.cookies.types.analytics.name")}</strong>:{" "}
                  {t("sections.cookies.types.analytics.description")}
                </li>
                <li>
                  <strong>{t("sections.cookies.types.functional.name")}</strong>
                  : {t("sections.cookies.types.functional.description")}
                </li>
                <li>
                  <strong>
                    {t("sections.cookies.types.advertising.name")}
                  </strong>
                  : {t("sections.cookies.types.advertising.description")}
                </li>
              </ul>
              <p className="mt-2">{t("sections.cookies.management")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.security.title")}
              </h2>
              <p>{t("sections.security.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.thirdParty.title")}
              </h2>
              <p>{t("sections.thirdParty.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.childrens.title")}
              </h2>
              <p>{t("sections.childrens.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.dataRetention.title")}
              </h2>
              <p>{t("sections.dataRetention.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {t("sections.userRights.title")}
              </h2>
              <p>{t("sections.userRights.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("sections.userRights.rights.access")}</li>
                <li>{t("sections.userRights.rights.rectification")}</li>
                <li>{t("sections.userRights.rights.erasure")}</li>
                <li>{t("sections.userRights.rights.restriction")}</li>
                <li>{t("sections.userRights.rights.portability")}</li>
                <li>{t("sections.userRights.rights.objection")}</li>
              </ul>
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

export default PrivacyPage;

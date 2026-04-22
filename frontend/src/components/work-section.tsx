"use client";

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { richTextToPlainText } from "@/lib/rich-text";

export function WorkSection({
  works,
  heading,
  description,
  buttonLabel,
  buttonUrl,
}: {
  works: any[];
  heading?: string;
  description?: string;
  buttonLabel?: string;
  buttonUrl?: string;
}) {
  return (
    <section id="islerimiz" className="bg-background py-24">
      <div className="container">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {heading || "Seçkin İşlerimiz"}
            </h2>
            <p className="text-lg font-normal text-muted-foreground">
              {description ||
                "Dijitalde iz bırakan, problem çözen ve binlerce kullanıcıya ulaşan projelerimizden bazıları."}
            </p>
          </div>
          <Link
            href={buttonUrl || "/islerimiz"}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-macework transition-all hover:underline"
          >
            {buttonLabel || "Tüm Projeleri Gör"}
            <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {works?.map((work, idx) => {
            const summary = richTextToPlainText(work.description) || work.description;

            return (
              <Link
                key={work.documentId || idx}
                href={`/islerimiz/${work.slug}`}
                className="group h-full"
              >
                <Card className="flex h-full flex-col overflow-hidden rounded-xl border-border/60 shadow-none transition-all duration-300 hover:border-macework/50 hover:shadow-md">
                  <CardHeader className="pb-4">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="border-none bg-macework/10 px-3 py-1 text-[10px] uppercase shadow-none"
                      >
                        {work.year}
                      </Badge>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {work.project_category?.name || "Genel"}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight leading-tight transition-colors group-hover:text-macework">
                      {work.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {work.tags?.slice(0, 3).map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="pointer-events-none border-border/50 text-[10px] font-semibold text-muted-foreground/80"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto flex items-center justify-between border-t border-border/40 pt-4 transition-colors group-hover:text-macework">
                    <span className="text-xs font-bold">Projeyi İncele</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-all group-hover:bg-macework group-hover:text-white">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

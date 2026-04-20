"use client";

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge"; // I'll create this or just use a span for now

export function WorkSection({ works, heading }: { works: any[], heading?: string }) {
  return (
    <section id="islerimiz" className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{heading || "Seçkin İşlerimiz"}</h2>
            <p className="text-lg text-muted-foreground font-normal">
              Dijitalde iz bırakan, problem çözen ve binlerce kullanıcıya ulaşan projelerimizden bazıları.
            </p>
          </div>
          <Link 
            href="/islerimiz" 
            className="group inline-flex items-center gap-2 text-sm font-semibold text-macework hover:underline transition-all"
          >
            Tüm Projeleri Gör
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works?.map((work, idx) => (
            <Link
              key={work.documentId || idx}
              href={`/islerimiz/${work.slug}`}
              className="group h-full"
            >
              <Card className="h-full border-border/60 hover:border-macework/50 transition-all duration-300 rounded-xl overflow-hidden flex flex-col shadow-none hover:shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-[10px] uppercase bg-macework/10 text-macework border-none shadow-none px-3 py-1">
                        {work.year}
                      </Badge>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{work.project_category?.name || 'Genel'}</span>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-macework transition-colors leading-tight">
                    {work.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {work.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {work.tags?.slice(0, 3).map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-[10px] font-semibold border-border/50 text-muted-foreground/80 pointer-events-none">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>


                <CardFooter className="pt-4 border-t border-border/40 mt-auto flex items-center justify-between group-hover:text-macework transition-colors">
                  <span className="text-xs font-bold">Projeyi İncele</span>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-macework group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


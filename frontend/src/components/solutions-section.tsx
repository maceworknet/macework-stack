"use client";

import * as LucideIcons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function SolutionsSection({ solutions, heading }: { solutions: any[], heading?: string }) {

  return (
    <section id="cozumler" className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{heading || "Kapsamlı Dijital Çözümler"}</h2>
          <p className="text-lg text-muted-foreground font-normal">
            İşletmenizin dijital dönüşüm yolculuğunda her adımda yanınızdayız. Stratejiden tasarıma, yazımdan büyümeye kadar tam hizmet.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions?.map((solution, idx) => {
            const Icon = (LucideIcons as any)[solution.icon] || LucideIcons.Code;
            return (
              <Link 
                key={solution.documentId || idx} 
                href={`/cozumler/${solution.slug}`}
                className="group h-full"
              >
                <Card className="h-full border-border/60 hover:border-macework/50 transition-all duration-300 relative overflow-hidden flex flex-col rounded-xl shadow-none hover:shadow-sm">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-1">
                    <ArrowUpRight className="w-5 h-5 text-macework" />
                  </div>

                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-macework mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {solution.short_description || solution.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}


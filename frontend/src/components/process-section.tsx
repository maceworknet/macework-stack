"use client";

export function ProcessSection({ steps, heading }: { steps: any[], heading?: string }) {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {heading || "Nasıl Çalışıyoruz?"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-[2px] bg-border/50 z-0"></div>
          
          {steps?.map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-macework/50 flex items-center justify-center text-sm font-bold text-macework mb-6 group-hover:border-macework group-hover:bg-macework group-hover:text-white transition-all duration-300">
                {item.step_number || item.step || (idx + 1).toString().padStart(2, '0')}
              </div>
              <h3 className="text-lg font-semibold tracking-tight mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


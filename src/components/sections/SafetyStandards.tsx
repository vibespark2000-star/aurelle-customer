"use client";

import { Eye, Lifebuoy as LifeBuoy, ShieldCheck, UserCheck } from "@phosphor-icons/react";
import React from "react";

import { useSilkReveal } from "@/hooks/useSilkReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const SafetyStandards: React.FC = () => {
  const containerRef = useSilkReveal<HTMLDivElement>();

  const standards = [
    {
      icon: <UserCheck size={22} weight="duotone" />,
      title: "Vetted Local Chauffeurs",
      description:
        "Our driver partners pass thorough background verifications and possess minimum 5+ years of highway experience across Tamil Nadu routes.",
    },
    {
      icon: <Eye size={22} weight="duotone" />,
      title: "24/7 Live GPS Telematics",
      description:
        "Every ride is tracked live by our central control team. Instant speed limit monitoring and route deviations alerts for peace of mind.",
    },
    {
      icon: <ShieldCheck size={22} weight="duotone" />,
      title: "Sanitized & Inspected Fleets",
      description:
        "Vehicles undergo strict mechanical checklist audits, tire tread checks, and AC sanitization before dispatching to any district.",
    },
    {
      icon: <LifeBuoy size={22} weight="duotone" />,
      title: "24/7 TN Breakdown Support",
      description:
        "In the unlikely event of mechanical issues on highways, a backup cab is immediately dispatched anywhere in Tamil Nadu.",
    },
  ];

  return (
    <section ref={containerRef} id="safety-standards" className="py-12 md:py-16 bg-surface">
      <div className="shell">
        <SectionHeading
          align="left"
          title="Safety Standards"
          titleRest="You Can Count On"
          subtitle="Long-distance inter-district travel demands driver discipline, vehicle readiness and real-time monitoring. Here's what we hold every trip to."
          className="silk-item mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {standards.map((std, idx) => (
            <div key={idx} className="silk-item card-hover p-6 flex flex-col">
              <span className="w-11 h-11 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                {std.icon}
              </span>
              <h3 className="text-[17px] font-bold text-ink mb-2">{std.title}</h3>
              <p className="text-[13px] text-ink-muted leading-relaxed">{std.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

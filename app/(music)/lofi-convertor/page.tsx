"use client";

import { HeroSection } from "@/components/hero-section";
import { UploadSection } from "@/components/upload-section";
import { CustomizationPanel } from "@/components/customization-panel";
import { Layout } from "@/components/layout/layout";

export default function Home() {
  return (
    <Layout>
      <div className="relative min-h-screen">
              <div className="relative z-10">
          <main className="pt-2">
            <HeroSection />
            <UploadSection />
            <CustomizationPanel />
          </main>
        </div>
      </div>
    </Layout>
  );
}
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import { QuickActions } from "@/components/home/QuickActions";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeader } from "@/components/ui/section-header";

export function HomeQuickActionsSection() {
  return (
    <PageSection
      as="section"
      aria-labelledby="home-quick-actions-heading"
    >
      <SectionHeader
        eyebrow="Quick Actions"
        title="次の行動へ"
        description="施設を探す、サ活を記録する、保存した施設を見る。よく使う操作をまとめました。"
      />

      <HomeSectionReveal className="mt-8">
        <QuickActions />
      </HomeSectionReveal>
    </PageSection>
  );
}

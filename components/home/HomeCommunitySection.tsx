import { FriendsActivity } from "@/components/home/FriendsActivity";
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import type { DashboardActivityPost } from "@/types/dashboard";

type HomeCommunitySectionProps = {
  posts: DashboardActivityPost[];
};

export function HomeCommunitySection({
  posts,
}: HomeCommunitySectionProps) {
  return (
    <PageSection
      as="section"
      aria-labelledby="home-community-heading"
    >
      <SectionHeader
        eyebrow="Community"
        title="みんなのサ活"
        description="TOTONOを使う人たちの記録から、新しい施設や次の楽しみ方を見つけられます。"
      />

      <HomeSectionReveal className="mt-8">
        <FriendsActivity posts={posts} />
      </HomeSectionReveal>
    </PageSection>
  );
}

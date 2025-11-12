import { CommunityHub } from "@/components/shared/community-hub";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-muted-foreground">Networking & employer integration</p>
        <h1 className="text-3xl font-bold">Counsellors, mentors, and APC programmes</h1>
        <p className="text-muted-foreground">Facilitate collaboration with RICS Matrics, employer APC schemes, and peer review circles.</p>
      </header>
      <CommunityHub />
    </div>
  );
}

import { MembershipModuleGrid } from "@/components/modules/membership-module-grid";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-muted-foreground">Membership lifecycle</p>
        <h1 className="text-3xl font-bold">Student → FRICS modules</h1>
        <p className="text-muted-foreground">Each module provides assessment prep, experience tracking, and AI guidance.</p>
      </header>
      <MembershipModuleGrid />
    </div>
  );
}

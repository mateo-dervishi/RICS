import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const studyGroups = [
  { city: "London", pathway: "Quantity Surveying", members: 42 },
  { city: "Manchester", pathway: "Building Surveying", members: 28 },
  { city: "Dubai", pathway: "Project Management", members: 31 }
];

const employerIntegrations = [
  { name: "Global Construct", programmes: 4, candidates: 120 },
  { name: "City Estates", programmes: 2, candidates: 68 }
];

export function CommunityHub() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Network</CardTitle>
          <CardDescription>Connect with counsellors, Matrics, mentors, and peer reviewers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-dashed border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Counsellors</p>
              <p className="text-2xl font-bold">58</p>
              <p className="text-xs text-muted-foreground">MRICS / FRICS available for matching</p>
            </div>
            <div className="rounded-lg border border-dashed border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Mentorship sessions</p>
              <p className="text-2xl font-bold">143</p>
              <p className="text-xs text-muted-foreground">Scheduled this quarter</p>
            </div>
            <div className="rounded-lg border border-dashed border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Peer reviews</p>
              <p className="text-2xl font-bold">37</p>
              <p className="text-xs text-muted-foreground">Documents in collaborative review</p>
            </div>
          </div>
          <Button>Launch mentor matching</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Groups & Events</CardTitle>
          <CardDescription>Filter by location, pathway, experience band.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {studyGroups.map((group) => (
            <div key={group.city} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div>
                <p className="font-semibold">{group.city}</p>
                <p className="text-xs text-muted-foreground">{group.pathway}</p>
              </div>
              <Badge variant="outline">{group.members} members</Badge>
            </div>
          ))}
          <Button variant="secondary">Find study group</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employer Integration</CardTitle>
          <CardDescription>Track corporate APC programmes and succession plans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {employerIntegrations.map((employer) => (
            <div key={employer.name} className="rounded-lg border border-dashed border-border/60 p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{employer.name}</p>
                <Badge variant="info">{employer.programmes} programmes</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{employer.candidates} candidates tracked</p>
            </div>
          ))}
          <Button size="sm">Connect employer</Button>
        </CardContent>
      </Card>
    </div>
  );
}

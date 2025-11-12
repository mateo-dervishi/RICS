import { subscriptionTiers } from "@/data/subscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SubscriptionShowcase() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Simple pricing</p>
          <h2 className="text-3xl font-bold">Subscription tiers that match every milestone</h2>
          <p className="text-muted-foreground">
            Start free as a student, unlock Professional tooling for APC preparation, or scale to enterprise APC programs with API
            access and analytics.
          </p>
        </div>
        <Badge variant="outline">Cancel anytime</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {subscriptionTiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <Badge variant="info">{tier.badge}</Badge>
              <CardTitle className="text-2xl">{tier.price}</CardTitle>
              <p className="text-sm text-muted-foreground">{tier.targetUsers}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-2 text-sm">
              <ul className="list-disc pl-4 text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button className="w-full">Choose plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}












import React from "react";
import { CreditCardIcon, ReceiptIcon, CheckIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";

const planFeatures = [
"Unlimited student identities",
"NFC & QR attendance",
"Reader device management",
"Campus access control"];


export function Billing() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Manage your plan, payment method and invoices." />
      

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current plan */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Current plan"
            action={<Badge tone="warning">Trial</Badge>} />
          
          <CardBody>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-2xl font-semibold text-ink">Institution</div>
                <p className="mt-1 text-sm text-ink-muted">
                  Your trial is active. Add a payment method to keep your workspace
                  running once the trial ends.
                </p>
                <ul className="mt-4 space-y-2">
                  {planFeatures.map((f) =>
                  <li key={f} className="flex items-center gap-2 text-sm text-ink">
                      <CheckIcon className="h-4 w-4 text-brand-600" strokeWidth={3} />
                      {f}
                    </li>
                  )}
                </ul>
              </div>
              <Button className="shrink-0">Activate plan</Button>
            </div>
          </CardBody>
        </Card>

        {/* Payment method */}
        <Card className="flex flex-col">
          <CardHeader title="Payment method" />
          <CardBody className="p-0 flex-1">
            <EmptyState
              icon={<CreditCardIcon className="h-6 w-6" />}
              title="No payment method"
              description="Add a card to activate your plan and avoid interruption after the trial."
              primaryAction={<Button size="sm">Add payment method</Button>}
              compact />
            
          </CardBody>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader title="Invoices" description="Your billing history" />
        <CardBody className="p-0">
          <EmptyState
            icon={<ReceiptIcon className="h-6 w-6" />}
            title="No invoices yet"
            description="Invoices will appear here once your plan is active and your first billing cycle completes."
            compact />
          
        </CardBody>
      </Card>
    </div>);

}
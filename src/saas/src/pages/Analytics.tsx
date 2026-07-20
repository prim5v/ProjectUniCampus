








import React from "react";
import { BarChart3Icon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";

export function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Trends and insights across attendance, access and identity." />
      
      <Card>
        <CardBody className="p-0">
          <EmptyState
            icon={<BarChart3Icon className="h-6 w-6" />}
            title="No analytics available yet"
            description="Analytics will appear after your university starts collecting operational data. Import students, register readers and run attendance to unlock insights." />
          
        </CardBody>
      </Card>
    </div>);

}
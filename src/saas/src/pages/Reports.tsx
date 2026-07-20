






import React from "react";
import { FileBarChartIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";

export function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Attendance and operational reports for your institution." />
      
      <Card>
        <CardBody className="p-0">
          <EmptyState
            icon={<FileBarChartIcon className="h-6 w-6" />}
            title="No reports available yet"
            description="Reports are generated from real attendance and access data. Run attendance sessions to start building your reporting history." />
          
        </CardBody>
      </Card>
    </div>);

}
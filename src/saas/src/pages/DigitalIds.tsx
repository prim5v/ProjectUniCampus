





import React from "react";
import { IdCardIcon, UsersIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { DataTable, type Column } from "../components/ui/DataTable";
import { DigitalIdStatusBadge } from "../lib/status";
import { useCollection } from "../hooks/useCollection";
import { getDigitalIds } from "../services/data";
import type { DigitalId } from "../types";

export function DigitalIds() {
  const navigate = useNavigate();
  const { data, loading } = useCollection(getDigitalIds);

  const columns: Column<DigitalId>[] = [
  {
    key: "studentName",
    header: "Student",
    render: (d) => <span className="font-medium text-ink">{d.studentName}</span>
  },
  { key: "studentId", header: "Student ID", render: (d) => d.studentId },
  { key: "credentialType", header: "Credential", render: (d) => d.credentialType },
  {
    key: "status",
    header: "Activation",
    render: (d) => <DigitalIdStatusBadge status={d.status} />
  },
  {
    key: "lastVerifiedAt",
    header: "Last verification",
    render: (d) => d.lastVerifiedAt ?? <span className="text-ink-muted">Never</span>
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital IDs"
        description="Issue and monitor the digital credentials assigned to your students." />
      

      <Card>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowKey={(d) => d.id}
          cardTitle={(d) => d.studentName}
          empty={
          <EmptyState
            icon={<IdCardIcon className="h-6 w-6" />}
            title="No digital IDs issued"
            description="Digital identities are created from your student records. Add students first, then issue credentials to activate campus access."
            primaryAction={
            <Button
              leftIcon={<UsersIcon className="h-4 w-4" />}
              onClick={() => navigate("/students")}>
              
                  Go to students
                </Button>
            } />

          } />
        
      </Card>
    </div>);

}
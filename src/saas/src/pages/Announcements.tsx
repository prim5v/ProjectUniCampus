








import React, { useState } from "react";
import { PlusIcon, MegaphoneIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { DataTable, type Column } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { FormField } from "../components/ui/FormField";
import { Input, Select, Textarea } from "../components/ui/Input";
import { useCollection } from "../hooks/useCollection";
import { getAnnouncements } from "../services/data";
import type { Announcement } from "../types";

export function Announcements() {
  const { data, loading } = useCollection(getAnnouncements);
  const [open, setOpen] = useState(false);

  const columns: Column<Announcement>[] = [
  {
    key: "title",
    header: "Title",
    render: (a) => <span className="font-medium text-ink">{a.title}</span>
  },
  { key: "audience", header: "Audience", render: (a) => a.audience },
  {
    key: "status",
    header: "Status",
    render: (a) =>
    <Badge tone={a.status === "published" ? "success" : "neutral"} dot>
          {a.status === "published" ? "Published" : "Draft"}
        </Badge>

  },
  {
    key: "publishedAt",
    header: "Published",
    render: (a) => a.publishedAt ?? <span className="text-ink-muted">—</span>
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Broadcast important messages to students and staff across your campus."
        actions={
        <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setOpen(true)}>
            New announcement
          </Button>
        } />
      

      <Card>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowKey={(a) => a.id}
          cardTitle={(a) => a.title}
          empty={
          <EmptyState
            icon={<MegaphoneIcon className="h-6 w-6" />}
            title="No announcements yet"
            description="Create your first announcement to notify students and staff about events, closures or policy updates."
            primaryAction={
            <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setOpen(true)}>
                  New announcement
                </Button>
            } />

          } />
        
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New announcement"
        description="Compose a message to broadcast to your campus."
        size="lg"
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Save draft
            </Button>
            <Button onClick={() => setOpen(false)}>Publish</Button>
          </>
        }>
        
        <div className="space-y-5">
          <FormField label="Title" required>
            {(p) => <Input placeholder="e.g. Campus closure — public holiday" {...p} />}
          </FormField>
          <FormField label="Audience" required>
            {(p) =>
            <Select className="w-full" {...p}>
                <option>All students &amp; staff</option>
                <option>Students only</option>
                <option>Staff only</option>
                <option>By faculty</option>
              </Select>
            }
          </FormField>
          <FormField label="Message" required>
            {(p) => <Textarea rows={5} placeholder="Write your announcement…" {...p} />}
          </FormField>
        </div>
      </Modal>
    </div>);

}
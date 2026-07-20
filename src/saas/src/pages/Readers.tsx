







import React, { useState } from "react";
import { PlusIcon, CpuIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { DataTable, type Column } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";
import { FormField } from "../components/ui/FormField";
import { Input, Select } from "../components/ui/Input";
import { ReaderStatusBadge } from "../lib/status";
import { useCollection } from "../hooks/useCollection";
import { getReaders } from "../services/data";
import type { Reader } from "../types";

export function Readers() {
  const { data, loading } = useCollection(getReaders);
  const [open, setOpen] = useState(false);

  const columns: Column<Reader>[] = [
  {
    key: "name",
    header: "Reader",
    render: (r) => <span className="font-medium text-ink">{r.name}</span>
  },
  { key: "location", header: "Location", render: (r) => r.location },
  { key: "type", header: "Type", render: (r) => r.type },
  {
    key: "status",
    header: "Status",
    render: (r) => <ReaderStatusBadge status={r.status} />
  },
  { key: "firmwareVersion", header: "Firmware", render: (r) => r.firmwareVersion },
  {
    key: "lastConnectionAt",
    header: "Last connection",
    render: (r) => r.lastConnectionAt ?? <span className="text-ink-muted">Never</span>
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Readers"
        description="Register and monitor the NFC/QR reader devices across your campus."
        actions={
        <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setOpen(true)}>
            Register reader
          </Button>
        } />
      

      <Card>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowKey={(r) => r.id}
          cardTitle={(r) => r.name}
          empty={
          <EmptyState
            icon={<CpuIcon className="h-6 w-6" />}
            title="No readers registered"
            description="Register your first NFC or QR reader to enable attendance check-ins and campus access control."
            primaryAction={
            <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setOpen(true)}>
                  Register reader
                </Button>
            } />

          } />
        
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Register reader"
        description="Add a new device to your reader network."
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Register</Button>
          </>
        }>
        
        <div className="space-y-5">
          <FormField label="Device name" required>
            {(p) => <Input placeholder="e.g. Main Gate Reader 01" {...p} />}
          </FormField>
          <FormField label="Serial number" required hint="Printed on the device label.">
            {(p) => <Input placeholder="e.g. RDR-000123" {...p} />}
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Type" required>
              {(p) =>
              <Select className="w-full" {...p}>
                  <option>NFC</option>
                  <option>QR</option>
                  <option>NFC + QR</option>
                </Select>
              }
            </FormField>
            <FormField label="Building">
              {(p) =>
              <Select className="w-full" {...p}>
                  <option value="">Unassigned</option>
                </Select>
              }
            </FormField>
          </div>
        </div>
      </Modal>
    </div>);

}
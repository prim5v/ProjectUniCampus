







import React, { useState } from "react";
import { PlusIcon, Building2Icon, CpuIcon, ShieldCheckIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { Modal } from "../components/ui/Modal";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { useCollection } from "../hooks/useCollection";
import { getBuildings } from "../services/data";

export function Buildings() {
  const { data, loading } = useCollection(getBuildings);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buildings"
        description="Manage campus locations, assigned readers and access permissions."
        actions={
        <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setOpen(true)}>
            Add building
          </Button>
        } />
      

      {loading ?
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) =>
        <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </Card>
        )}
        </div> :
      data.length === 0 ?
      <Card>
          <CardBody className="p-0">
            <EmptyState
            icon={<Building2Icon className="h-6 w-6" />}
            title="No campus locations added"
            description="Add the buildings and sites you operate, then assign readers and configure access permissions for each."
            primaryAction={
            <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setOpen(true)}>
                  Add building
                </Button>
            } />
          
          </CardBody>
        </Card> :

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b) =>
        <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Building2Icon className="h-5 w-5" />
                </div>
                <Badge tone="neutral">{b.code}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{b.name}</h3>
              <p className="text-sm text-ink-muted">{b.address}</p>
              <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CpuIcon className="h-3.5 w-3.5" /> {b.readerCount} readers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheckIcon className="h-3.5 w-3.5" /> {b.accessGroups} groups
                </span>
              </div>
            </Card>
        )}
        </div>
      }

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add building"
        description="Register a new campus location."
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Add building</Button>
          </>
        }>
        
        <div className="space-y-5">
          <FormField label="Building name" required>
            {(p) => <Input placeholder="e.g. Science Block A" {...p} />}
          </FormField>
          <FormField label="Building code" required hint="A short identifier used on devices and reports.">
            {(p) => <Input placeholder="e.g. SBA" {...p} />}
          </FormField>
          <FormField label="Address">
            {(p) => <Input placeholder="Street, campus, city" {...p} />}
          </FormField>
        </div>
      </Modal>
    </div>);

}
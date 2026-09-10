







import React, { useCallback, useState } from "react";
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
import { getReaders, getBuildings } from "../services/data";
import type { Reader } from "../types";
import { useApi } from "../contexts/ApiContext";
import { useAuthContext } from "../contexts/AuthContext";

export function Readers() {
  const {api} = useApi();
  const fetchReaders = useCallback(
    () => getReaders(api),
    [api]
  );
  const { data, loading, refresh } = useCollection(fetchReaders);
  const fetchBuildings = useCallback(
    () => getBuildings(api),
    [api]
  );

  const {
    data: buildings,
    loading: buildingsLoading
  } = useCollection(fetchBuildings);

  const [open, setOpen] = useState(false);

  const [readerName, setReaderName] = useState("");
  const [readerId, setReaderId ] = useState("");
  const [readerType, setReaderType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [buildingId, setBuildingId] = useState("")
  const [designation, setDesignation] = useState("");

  const { setLoading, setError, setMessage, setSuccessStatus } = useAuthContext();

  const [adding, setAdding] =
    useState(false);

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

  const addReader = async() =>{

    if(!readerId.trim()){
      alert("ReaderId required");
      return;
    }
    if(!readerName.trim()){
      alert("Readername required");
      return;
    }

  const payload = {
    reader_id: readerId.trim(),
    reader_name: readerName.trim(),
    reader_type: readerType.trim(),
    service_type: serviceType.trim(),
    designation: designation.trim(),
    building_id: buildingId,
  }

  console.log("Adding reader:", payload);

  try {
    setAdding(true);

    const response = await api.post(
      "/admin/add/reader",
      payload
    );

    console.log(
      "Adding reader response:",
      response.data
    );

    if(response.data?.success){
      setBuildingId("");
      setDesignation("");
      setReaderId("");
      setReaderName("");
      setServiceType("");
      setReaderType("");
      setSuccessStatus("success")
      setMessage(
        response.data?.message ||
        "Reader added successuffly"
      );
      setError({});

      setOpen(false);

      refresh();
    }else{
      setError(response.data?.message);
      setSuccessStatus("error")
    }
  } catch (error: any) {
    console.log(
      "Failed to add reader:",
      error?.response?.data || error
    );
    let message =
    "Something went wrong";

    const axiosError = error as {
      response?: {
        data?:{
          message?: string;
        };
      };
    };
    message = axiosError.response?.data?.message || message;
    setError(message);
    setSuccessStatus("error")
    
  } finally{
    setLoading(false);
    setAdding(false);
  };

};



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
            <Button onClick={addReader}>{adding ? "Adding..." : "Add reader"}</Button>
          </>
        }>
        
        <div className="space-y-5">
          <FormField
            label="Device name"
            required
          >
            {() => (
              <Input
                placeholder="e.g. Main Gate Reader 01"
                value={readerName}
                onChange={(e) => setReaderName(e.target.value)}
              />
            )}
          </FormField>

          <FormField
            label="Serial number"
            required
            hint="Printed on the device label."
          >
            {() => (
              <Input
                placeholder="e.g. RDR-000123"
                value={readerId}
                onChange={(e) => setReaderId(e.target.value)}
              />
            )}
          </FormField>
          <FormField
            label="Designation of the reader"
            required
            hint="Where is the reader located?"
          >
            {() => (
              <Input
                placeholder="e.g. Gate / Door 101"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            )}
          </FormField>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Reader Type"
            value={readerType}
            required
          >
            {(p) => (
              <Select
                className="w-full"
                {...p}
                value={readerType}
                onChange={(e) => setReaderType(e.target.value)}
              >
                <option value="">Select reader type</option>
                <option value="NFC">NFC</option>
                <option value="QR">QR</option>
                <option value="QR+NFC">NFC + QR</option>
              </Select>
            )}
          </FormField>

            <FormField
            label="Service Type"
            value={serviceType}
            required
          >
            {(p) => (
              <Select
                className="w-full"
                {...p}
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="">Select service type</option>
                <option value="Access">Access</option>
                <option value="Payment">POS</option>
                <option value="Attendance">Attendance</option>
              </Select>
            )}
          </FormField>

            <FormField
              label="Building"
              value={buildingId}
            >
              {(p) => (
                <Select
                  className="w-full"
                  {...p}
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                >
                  <option value="">Unassigned</option>

                  {buildings.map((building) => (
                    <option
                      key={building.id}
                      value={building.id}
                    >
                      {building.code} — {building.name}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            
          </div>
        </div>
      </Modal>
    </div>);

}
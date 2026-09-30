import React, { useCallback, useState } from "react";

import {
  ShieldCheckIcon,
  DoorOpenIcon,
  SlidersHorizontalIcon,
  ClipboardCheckIcon,
} from "lucide-react";

import { PageHeader } from "../components/PageHeader";

import {
  Card,
  CardHeader,
  CardBody,
} from "../components/ui/Card";

import { Button } from "../components/ui/Button";
import { useApi } from "../contexts/ApiContext";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";

import {
  DataTable,
  type Column,
} from "../components/ui/DataTable";
import { FormField } from "../components/ui/FormField";
import { useAuthContext } from "../contexts/AuthContext";
import { useCollection } from "../hooks/useCollection";
import {getServicesData, getReaders} from "../services/data";

type AccessRecord = {
  id: string;
  student: string;
  admissionNumber: string;
  location: string;
  method: string;
  direction: string;
  result: "granted" | "denied";
  timestamp: string;
};

const accessRules = [
  {
    label: "Verification method",
    value: "NFC or QR",
    hint: "Students can verify their identity using supported campus credentials.",
  },
  {
    label: "Access mode",
    value: "Reader controlled",
    hint: "Access decisions are handled through registered campus readers.",
  },
  {
    label: "Denied access logging",
    value: "Enabled",
    hint: "Failed access attempts are recorded for administrator review.",
  },
];

export function Access() {
  const [tab, setTab] = useState<
    "activity" | "zones" | "rules"
  >("activity");

  /*
   * No fake access records.
   *
   * Later this can become:
   *
   * const { data, loading } = useCollection(getAccessRecords);
   */
  // const data: AccessRecord[] = [];
  // const loading = false;
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addServiceModule, setAddserviceModule] = useState(false);
  const [serviceId, setServiceId] = useState("1");
  // service id will be hardcoded to the id the page gives 
  const [readerId, setReaderId] = useState("");
  const [designationName, setDesignationName] = useState("");
  const {api} = useApi();
  const { setLoading, setError, setMessage, setSuccessStatus } = useAuthContext();

  const fetchServices = useCallback(
    ()=> getServicesData(api, serviceId),
    [api, serviceId]
  );

  const fetchReaders = useCallback(
    ()=> getReaders(api),
    [api]
  );


  const {
    data,
    loading,
    refresh,
  } = useCollection(fetchServices);

  const {
    data: readers,
    loading: readersLoading,
  } = useCollection(fetchReaders);

  const columns: Column<AccessRecord>[] = [
    {
      key: "student",
      header: "Student",
      render: (record) => (
        <div>
          <div className="font-medium text-ink">
            {record.student}
          </div>

          <div className="text-xs text-ink-muted">
            {record.admissionNumber}
          </div>
        </div>
      ),
    },

    {
      key: "location",
      header: "Location",
      render: (record) => record.location,
    },

    {
      key: "method",
      header: "Method",
      render: (record) => record.method,
    },

    {
      key: "direction",
      header: "Direction",
      render: (record) => record.direction,
    },

    {
      key: "result",
      header: "Result",
      render: (record) => (
        <span
          className={
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
            (record.result === "granted"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700")
          }
        >
          {record.result === "granted"
            ? "Granted"
            : "Denied"}
        </span>
      ),
    },

    {
      key: "timestamp",
      header: "Time",
      render: (record) => record.timestamp,
    },
  ];

  const tabs = [
    {
      id: "activity" as const,
      label: "Activity",
    },
    {
      id: "zones" as const,
      label: "Access zones",
    },
    {
      id: "rules" as const,
      label: "Rules",
    },
  ];


  // if(addServiceModule){
  //   return(
  //     <div>
  //       <form>
  //         <FormField>
  //           <Input/>
  //         </FormField>
  //       </form>
  //     </div>
  //   )
  // }
  const createService = async () =>{

    const payload = {
      service_id: serviceId,
      reader_id: readerId,
      designation_name : designationName
    }
    // console.log("payload", payload);

    try {
      setAdding(true);
      const response = await api.post(
        "/admin/create/service",
        payload
      );

      console.log(
        "Creating service:",
        response.data
      );
      if(response.data?.success){
        // setServiceId("");
        setReaderId("");
        setDesignationName("");
        setSuccessStatus("success");
        setMessage(
          response.data?.message ||
          "Service created successfully"
        );
        setError({});
        setOpen(false);
        refresh();
      }else{
        setError(response.data?.message);
        setSuccessStatus("error");
      }
     

    } catch (error) {
      let message = "Something went wrong.";
      const axiosError = error as {
        response?:{
          data?:{
            message?: string;
          };
        };
      };
      message = axiosError.response?.data?.message || message;
      setError(message);
      setSuccessStatus("error");
    }finally{
      setLoading(false);
      setAdding(false);
    }
  };
  
// console.log("READERS USED BY UI:", readers);
// console.log("FIRST READER:", readers?.[0]);
// console.log("READER NAME:", readers?.[0]?.reader_name);
// console.log("payload:", payload);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access"
        description="Control campus access, monitor verification activity, and manage access rules."
        actions={
          tab === "zones" ? (
            <Button
              leftIcon={
                <DoorOpenIcon className="h-4 w-4" />
              }
            >
              Add access zone
            </Button>
          ) : tab === "activity" ?(
            <Button onClick={ () =>setOpen(true)}>
              Add access service
            </Button>
          ) : undefined
        }
      /> 

      {/* Tabs */}
      <div className="border-b border-line">
        <nav
          className="-mb-px flex gap-6"
          aria-label="Access views"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "border-b-2 pb-3 text-sm font-medium transition-colors " +
                (tab === t.id
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-ink-muted hover:text-ink")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Activity */}
      {tab === "activity" && (
        <Card>
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            rowKey={(record) => record.id}
            cardTitle={(record) => record.student}
            empty={
              <EmptyState
                icon={
                  <ClipboardCheckIcon className="h-6 w-6" />
                }
                title="No access activity"
                description="Student access attempts will appear here once campus readers begin processing NFC or QR verification."
              />
            }
          />
        </Card>
      )}

      {/* Access Zones */}
      {tab === "zones" && (
        <Card>
          <CardHeader
            title="Access zones"
            description="Manage the campus locations where student identity verification is required."
            action={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={
                  <DoorOpenIcon className="h-4 w-4" />
                }
              >
                Add zone
              </Button>
            }
          />

          <CardBody>
            <EmptyState
              icon={
                <DoorOpenIcon className="h-6 w-6" />
              }
              title="No access zones"
              description="Create an access zone and assign registered readers to control entry points around your campus."
              primaryAction={
                <Button
                  leftIcon={
                    <DoorOpenIcon className="h-4 w-4" />
                  }
                >
                  Add access zone
                </Button>
              }
            />
          </CardBody>
        </Card>
      )}

      {/* Rules */}
      {tab === "rules" && (
        <Card>
          <CardHeader
            title="Access rules"
            description="Configure how student identity verification is handled across campus."
            action={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={
                  <SlidersHorizontalIcon className="h-4 w-4" />
                }
              >
                Edit rules
              </Button>
            }
          />

          <ul className="divide-y divide-line">
            {accessRules.map((rule) => (
              <li
                key={rule.label}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <div className="text-sm font-medium text-ink">
                    {rule.label}
                  </div>

                  <div className="text-sm text-ink-muted">
                    {rule.hint}
                  </div>
                </div>

                <span className="text-sm font-medium text-ink-muted">
                  {rule.value}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

<Modal
  open={open}
  onClose={() => {
    if (!adding) {
      setOpen(false);
    }
  }}
  title="Create Access Service"
  description="Create a new Access Service for session records."
  footer={
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(false)}
        disabled={adding}
      >
        Cancel
      </Button>

      <Button
        onClick={createService}
        disabled={
          adding ||
          !designationName.trim() ||
          !readerId
        }
      >
        {adding ? "Creating..." : "Create Service"}
      </Button>
    </>
  }
>
  <div className="space-y-5">

    {/* Service ID */}
    <FormField
      label="Service ID"
      value={serviceId}
    >
      {(p) => (
        <input
          {...p}
          value={serviceId}
          disabled
          className="w-full rounded-md border border-line bg-gray-50 px-3 py-2 text-sm text-ink"
        />
      )}
    </FormField>

    {/* Designation Name */}
    <FormField
      label="Designation name"
      value={designationName}
    >
      {(p) => (
        <input
          {...p}
          className="w-full"
          value={designationName}
          onChange={(e) => setDesignationName(e.target.value)}
          placeholder="e.g. Main Gate"
        />
      )}
    </FormField>

    {/* Reader */}
    <FormField
      label="Reader"
      value={readerId}
    >
      {(p) => (
        <select
          className="w-full"
          {...p}
          value={readerId}
          onChange={(e) => setReaderId(e.target.value)}
          disabled={readersLoading}
        >
          <option value="">
            {readersLoading
              ? "Loading readers..."
              : "Select a reader"}
          </option>

          {readers?.map((reader) => (
            <option
              key={reader.readerId}
              value={reader.readerId}
            >
              {reader.readerName}
            </option>
          ))}
        </select>
      )}
    </FormField>

  </div>
</Modal>
      
    </div>
  );
}
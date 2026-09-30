import React, { useCallback, useState } from "react";

import {
  CreditCardIcon,
  WalletCardsIcon,
  SlidersHorizontalIcon,
  ReceiptIcon,
} from "lucide-react";

import { PageHeader } from "../components/PageHeader";
import { useApi } from "../contexts/ApiContext";
import {
  Card,
  CardHeader,
  CardBody,
} from "../components/ui/Card";

import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { EmptyState } from "../components/ui/EmptyState";

import {
  DataTable,
  type Column,
} from "../components/ui/DataTable";
import { useCollection } from "../hooks/useCollection";
import { getServicesData, getReaders } from "../services/data";
import { read } from "fs";
import { useAuthContext } from "../contexts/AuthContext";

type Payment = {
  id: string;
  student: string;
  admissionNumber: string;
  amount: string;
  reference: string;
  method: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
};

const paymentRules = [
  {
    label: "Payment provider",
    value: "Not configured",
    hint: "The payment service used to process campus payments.",
  },
  {
    label: "Student wallet",
    value: "Enabled",
    hint: "Students can hold funds for approved campus services.",
  },
  {
    label: "Payment verification",
    value: "Manual",
    hint: "Transactions are verified before being marked as completed.",
  },
];

export function Payments() {
  const [tab, setTab] = useState<
    "transactions" | "wallet" | "rules"
  >("transactions");

  /*
   * No fake payment records.
   *
   * This will later be replaced with:
   *
   * const { data, loading } = useCollection(getPayments);
   *
   * once getPayments() is connected to your backend.
   */
  // const data: Payment[] = [];
  const [serviceId, setServiceId] = useState("5");
  const [readerId, setReaderId] = useState("");
  const [designationName, setDesignationName] = useState("");
  // const loading = false;
  const [open, setOpen] = useState(false);
  const [adding, setAdding]= useState(false);
  const {api} = useApi();
  const { setLoading, setError, setMessage, setSuccessStatus } = useAuthContext

  const columns: Column<Payment>[] = [
    {
      key: "student",
      header: "Student",
      render: (payment) => (
        <div>
          <div className="font-medium text-ink">
            {payment.student}
          </div>

          <div className="text-xs text-ink-muted">
            {payment.admissionNumber}
          </div>
        </div>
      ),
    },

    {
      key: "amount",
      header: "Amount",
      render: (payment) => (
        <span className="font-medium text-ink">
          {payment.amount}
        </span>
      ),
    },

    {
      key: "reference",
      header: "Reference",
      render: (payment) => payment.reference,
    },

    {
      key: "method",
      header: "Method",
      render: (payment) => payment.method,
    },

    {
      key: "status",
      header: "Status",
      render: (payment) => (
        <span
          className={
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
            (payment.status === "completed"
              ? "bg-green-50 text-green-700"
              : payment.status === "pending"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700")
          }
        >
          {payment.status.charAt(0).toUpperCase() +
            payment.status.slice(1)}
        </span>
      ),
    },

    {
      key: "createdAt",
      header: "Date",
      render: (payment) => payment.createdAt,
    },
  ];

  const tabs = [
    {
      id: "transactions" as const,
      label: "Transactions",
    },
    {
      id: "wallet" as const,
      label: "Wallet",
    },
    {
      id: "rules" as const,
      label: "Rules",
    },
  ];

  const fetchServices = useCallback(
    () => getServicesData(api, serviceId),
    [api, serviceId]
  );

  const fetchReaders = useCallback(
    () => getReaders(api),
    [api]
  )

  const {
    data,
    loading,
    refresh,
  } = useCollection(fetchServices);

  const {
    data: readers,
    loading: readersLoading,
  } = useCollection(fetchReaders);


  const createTransacctionService = async () =>{
    const payload = {
      service_id:serviceId,
      reader_id: readerId,
      designation_name: designationName
    }

    try {
      setAdding(true);
      const response = await api.post(
        "/admin/create/service",
        payload
      );

      console.log(
        "creating transaction service",
        response.data
      );
      if(response.data?.success){
        // setServiceId("")
        setDesignationName("");
        setReaderId("");
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
      let message = "Something went wrong";
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
      setAdding(false);
    }
  }

  console.log("READERS USED BY UI:", readers);
  console.log("FIRST READER:", readers?.[0]);
  console.log("READER NAME:", readers?.[0]?.readerName);
  // console.log("payload:", payload);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Manage campus payments, student wallets, and payment rules."
        actions={
          tab === "transactions" ? (
            <Button
              leftIcon={
                <CreditCardIcon className="h-4 w-4" />
              }
              onClick={()=> setOpen(true)}
            >
              New transaction service
            </Button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="border-b border-line">
        <nav
          className="-mb-px flex gap-6"
          aria-label="Payment views"
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

      {/* Transactions */}
      {tab === "transactions" && (
        <Card>
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            rowKey={(payment) => payment.id}
            cardTitle={(payment) => payment.student}
            empty={
              <EmptyState
                icon={
                  <ReceiptIcon className="h-6 w-6" />
                }
                title="No payment transactions"
                description="Payment transactions will appear here once students begin making campus payments."
                primaryAction={
                  <Button
                    leftIcon={
                      <CreditCardIcon className="h-4 w-4" />
                    }
                    onClick={()=> setOpen(true)}
                  >
                    New transaction
                  </Button>
                }
              />
            }
          />
        </Card>
      )}

      {/* Wallet */}
      {tab === "wallet" && (
        <Card>
          <CardHeader
            title="Student wallets"
            description="Monitor student wallet activity and campus balances."
            action={
              <Button
                variant="secondary"
                size="sm"
                leftIcon={
                  <WalletCardsIcon className="h-4 w-4" />
                }
              >
                Wallet settings
              </Button>
            }
          />

          <CardBody>
            <EmptyState
              icon={
                <WalletCardsIcon className="h-6 w-6" />
              }
              title="No wallet activity"
              description="Student wallet balances and activity will appear here once the campus wallet system is active."
            />
          </CardBody>
        </Card>
      )}

      {/* Rules */}
      {tab === "rules" && (
        <Card>
          <CardHeader
            title="Payment rules"
            description="Configure how payments and wallets operate across your institution."
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
            {paymentRules.map((rule) => (
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

    {/* ```jsx */}
<Modal
  open={open}
  onClose={() => {
    if (!adding) {
      setOpen(false);
    }
  }}
  title="Create Transaction Service"
  description="Create a new transaction service for session records"
  footer={
    <div className="flex items-center justify-end gap-3">
      <Button
        variant="secondary"
        onClick={() => setOpen(false)}
        disabled={adding}
      >
        Cancel
      </Button>

      <Button
        onClick={createTransacctionService}
        disabled={adding || !designationName || !readerId}
      >
        {adding ? "Creating..." : "Create service"}
      </Button>
    </div>
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
          value={designationName}
          onChange={(e) => setDesignationName(e.target.value)}
          placeholder="e.g. Main Gate"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
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
          {...p}
          value={readerId}
          onChange={(e) => setReaderId(e.target.value)}
          disabled={readersLoading}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50"
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
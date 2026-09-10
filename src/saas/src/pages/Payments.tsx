import React, { useState } from "react";

import {
  CreditCardIcon,
  WalletCardsIcon,
  SlidersHorizontalIcon,
  ReceiptIcon,
} from "lucide-react";

import { PageHeader } from "../components/PageHeader";

import {
  Card,
  CardHeader,
  CardBody,
} from "../components/ui/Card";

import { Button } from "../components/ui/Button";

import { EmptyState } from "../components/ui/EmptyState";

import {
  DataTable,
  type Column,
} from "../components/ui/DataTable";

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
  const data: Payment[] = [];
  const loading = false;

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
            >
              New transaction
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
    </div>
  );
}
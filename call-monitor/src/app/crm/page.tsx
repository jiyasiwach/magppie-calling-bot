import type { Metadata } from "next";
import { CrmDashboard } from "@/components/crm/CrmDashboard";

export const metadata: Metadata = {
  title: "Magppie · Zoho CRM Leads",
  description: "Every lead in the Magppie Zoho CRM — pipeline, sources, and the freshest activity.",
};

export default function CrmPage() {
  return <CrmDashboard />;
}

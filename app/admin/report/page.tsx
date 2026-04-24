"use client"
import { useMemo, useState, useEffect } from "react";
import {
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  FileText,
  Filter,
  Gem,
  LayoutDashboard,
  LoaderCircle,
  Package,
  Printer,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DateRange = "7d" | "30d" | "custom";
type ReportType = "orders" | "revenue" | "users" | "artisans" | "agents";
type SortKey = "date" | "amount";
type SortDirection = "asc" | "desc";

type ReportRow = {
  id: string;
  name: string;
  status: string;
  amount: number;
  date: string;
  region: string;
};

type HeaderFilter = "all" | "role" | "status" | "region";



const reportTypeOptions: { value: ReportType; label: string }[] = [
  { value: "orders", label: "Orders" },
  { value: "revenue", label: "Revenue" },
  { value: "users", label: "Users" },
  { value: "artisans", label: "Artisans" },
  { value: "agents", label: "Agents" },
];

const regions = ["Addis Ababa", "Oromia", "Amhara", "Sidama", "Tigray"];
const roles = ["Customer", "Artisan", "Agent", "Admin"];
const statuses = ["Active", "Pending", "Suspended", "Completed", "Cancelled"];

const reportDataset: Record<ReportType, ReportRow[]> = {
  orders: [
    { id: "ORD-22109", name: "Mekdes Bekele", status: "Completed", amount: 4200, date: "2026-04-20", region: "Addis Ababa" },
    { id: "ORD-22110", name: "Abel Lemma", status: "Completed", amount: 6900, date: "2026-04-20", region: "Oromia" },
    { id: "ORD-22111", name: "Hanna Asefa", status: "Pending", amount: 1850, date: "2026-04-19", region: "Amhara" },
    { id: "ORD-22112", name: "Saron Tadesse", status: "Completed", amount: 10400, date: "2026-04-18", region: "Sidama" },
    { id: "ORD-22113", name: "Bereket Mulu", status: "Cancelled", amount: 2700, date: "2026-04-18", region: "Addis Ababa" },
    { id: "ORD-22114", name: "Rahel Kebede", status: "Completed", amount: 5200, date: "2026-04-17", region: "Tigray" },
    { id: "ORD-22115", name: "Yonas Fikru", status: "Completed", amount: 7600, date: "2026-04-17", region: "Oromia" },
    { id: "ORD-22116", name: "Lulit Desta", status: "Pending", amount: 3200, date: "2026-04-16", region: "Amhara" },
    { id: "ORD-22117", name: "Marta Gebru", status: "Completed", amount: 8800, date: "2026-04-16", region: "Sidama" },
    { id: "ORD-22118", name: "Tigist Abera", status: "Completed", amount: 4600, date: "2026-04-15", region: "Addis Ababa" },
  ],
  revenue: [
    { id: "REV-1001", name: "Addis Loom Studio", status: "Active", amount: 182500, date: "2026-04-20", region: "Addis Ababa" },
    { id: "REV-1002", name: "Meklit Ceramics", status: "Active", amount: 148300, date: "2026-04-19", region: "Oromia" },
    { id: "REV-1003", name: "Walia Woodcraft", status: "Active", amount: 121900, date: "2026-04-18", region: "Amhara" },
    { id: "REV-1004", name: "Hawassa Leather", status: "Pending", amount: 93600, date: "2026-04-17", region: "Sidama" },
    { id: "REV-1005", name: "Abeba Textiles", status: "Active", amount: 76400, date: "2026-04-16", region: "Tigray" },
  ],
  users: [
    { id: "USR-4401", name: "Selamawit Tarekegn", status: "Active", amount: 12, date: "2026-04-20", region: "Addis Ababa" },
    { id: "USR-4402", name: "Dawit Mamo", status: "Suspended", amount: 4, date: "2026-04-19", region: "Amhara" },
    { id: "USR-4403", name: "Hanna Moges", status: "Active", amount: 18, date: "2026-04-19", region: "Oromia" },
    { id: "USR-4404", name: "Lensa Daba", status: "Active", amount: 9, date: "2026-04-17", region: "Sidama" },
    { id: "USR-4405", name: "Fitsum Admasu", status: "Pending", amount: 2, date: "2026-04-15", region: "Tigray" },
  ],
  artisans: [
    { id: "ART-801", name: "Marta Woven Atelier", status: "Active", amount: 126000, date: "2026-04-20", region: "Addis Ababa" },
    { id: "ART-802", name: "Nardos Pottery", status: "Pending", amount: 88200, date: "2026-04-18", region: "Oromia" },
    { id: "ART-803", name: "Abenezer Craftworks", status: "Active", amount: 104500, date: "2026-04-17", region: "Amhara" },
    { id: "ART-804", name: "Meskerem Threads", status: "Suspended", amount: 42100, date: "2026-04-15", region: "Sidama" },
  ],
  agents: [
    { id: "AGT-91", name: "Hana T", status: "Active", amount: 34, date: "2026-04-20", region: "Addis Ababa" },
    { id: "AGT-92", name: "Yared B", status: "Active", amount: 28, date: "2026-04-19", region: "Oromia" },
    { id: "AGT-93", name: "Selam K", status: "Pending", amount: 17, date: "2026-04-18", region: "Amhara" },
    { id: "AGT-94", name: "Mimi A", status: "Active", amount: 22, date: "2026-04-17", region: "Sidama" },
  ],
};

function formatAmount(type: ReportType, value: number) {
  if (type === "orders") return `ETB ${value.toLocaleString()}`;
  if (type === "revenue") return `ETB ${value.toLocaleString()}`;
  if (type === "users") return `${value} orders`;
  if (type === "artisans") return `ETB ${value.toLocaleString()}`;
  return `${value} tasks`;
}

function getRowRole(reportType: ReportType) {
  if (reportType === "artisans" || reportType === "revenue") return "Artisan";
  if (reportType === "agents") return "Agent";
  return "Customer";
}

function SummaryCards({ rows, reportType, enabled }: { rows: ReportRow[]; reportType: ReportType; enabled: boolean }) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const completed = rows.filter((row) => row.status === "Completed" || row.status === "Active").length;
  const average = rows.length ? total / rows.length : 0;
  const successRate = rows.length ? (completed / rows.length) * 100 : 0;

  const cards = [
    { label: "Total Revenue", value: `ETB ${total.toLocaleString()}` },
    { label: `Total ${reportType === "orders" ? "Orders" : "Records"}`, value: rows.length.toLocaleString() },
    { label: "Average Value", value: formatAmount(reportType, Math.round(average)) },
    { label: "Success Rate", value: `${successRate.toFixed(1)}%` },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{card.label}</p>
          <p className={cn("mt-2 text-xl font-bold", !enabled && "text-stone-300")}>{enabled ? card.value : "--"}</p>
        </div>
      ))}
    </section>
  );
}

function ReportFilters({
  selectedRoles,
  selectedStatuses,
  selectedRegions,
  includeInactive,
  search,
  onToggleRole,
  onToggleStatus,
  onToggleRegion,
  onToggleInactive,
  onSearch,
}: {
  selectedRoles: string[];
  selectedStatuses: string[];
  selectedRegions: string[];
  includeInactive: boolean;
  search: string;
  onToggleRole: (value: string) => void;
  onToggleStatus: (value: string) => void;
  onToggleRegion: (value: string) => void;
  onToggleInactive: () => void;
  onSearch: (value: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-[#C6A75E]" />
        <h3 className="font-display text-lg font-bold">Report Builder</h3>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">Search IDs</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search by user ID, order ID, artisan ID..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#C6A75E]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">Role</label>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => onToggleRole(role)}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                  selectedRoles.includes(role)
                    ? "border-[#C6A75E] bg-[#C6A75E]/15 text-[#7A6024]"
                    : "border-stone-200 text-stone-600"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.slice(0, 4).map((status) => (
              <button
                key={status}
                onClick={() => onToggleStatus(status)}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                  selectedStatuses.includes(status)
                    ? "border-[#C6A75E] bg-[#C6A75E]/15 text-[#7A6024]"
                    : "border-stone-200 text-stone-600"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => onToggleRegion(region)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                selectedRegions.includes(region)
                  ? "border-[#C6A75E] bg-[#C6A75E]/15 text-[#7A6024]"
                  : "border-stone-200 text-stone-600"
              )}
            >
              {region}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleInactive}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition",
            includeInactive ? "border-[#C6A75E] bg-[#C6A75E]/15 text-[#7A6024]" : "border-stone-200 text-stone-500"
          )}
        >
          <span
            className={cn(
              "relative h-4 w-8 rounded-full transition",
              includeInactive ? "bg-[#C6A75E]" : "bg-stone-300"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3 w-3 rounded-full bg-white transition",
                includeInactive ? "left-4" : "left-0.5"
              )}
            />
          </span>
          Include inactive users
        </button>
      </div>
    </section>
  );
}

function DataTable({
  rows,
  reportType,
  loading,
  generated,
  sortKey,
  sortDirection,
  onSort,
}: {
  rows: ReportRow[];
  reportType: ReportType;
  loading: boolean;
  generated: boolean;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  if (!generated) {
    return (
      <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C6A75E]/15 text-[#7A6024]">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="font-display text-xl font-bold">No Report Generated</h3>
        <p className="mt-2 text-sm text-stone-500">Select filters and generate a report.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="max-h-[460px] overflow-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3">{reportType === "orders" ? "Order ID" : "Record ID"}</th>
              <th className="px-4 py-3">{reportType === "orders" ? "Customer" : "Name"}</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">
                <button onClick={() => onSort("amount")} className="inline-flex items-center gap-1 font-semibold">
                  Amount (ETB)
                  {sortKey === "amount" ? <ChevronDown className={cn("h-3.5 w-3.5", sortDirection === "asc" && "rotate-180")} /> : null}
                </button>
              </th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">
                <button onClick={() => onSort("date")} className="inline-flex items-center gap-1 font-semibold">
                  Date
                  {sortKey === "date" ? <ChevronDown className={cn("h-3.5 w-3.5", sortDirection === "asc" && "rotate-180")} /> : null}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-t border-stone-100">
                  {Array.from({ length: 6 }).map((__, col) => (
                    <td key={col} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
                    </td>
                  ))}
                </tr>
              ))
              : rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "cursor-pointer border-t border-stone-100 transition hover:bg-[#C6A75E]/10",
                    index % 2 === 0 ? "bg-white" : "bg-stone-50/40"
                  )}
                >
                  <td className="px-4 py-3 font-medium">{row.id}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        row.status === "Completed" || row.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : row.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">ETB {row.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{row.region}</td>
                  <td className="px-4 py-3 text-stone-500">{row.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ExportActions({ generated }: { generated: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [generatedOn, setGeneratedOn] = useState("");

  useEffect(() => {
    setMounted(true);
    setGeneratedOn(new Date().toLocaleString());
  }, []);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold">Export Report</h3>
          <p className="text-xs text-stone-500">Generated on: {mounted ? generatedOn : "--"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={!generated}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileDown className="h-4 w-4" /> Export CSV
          </button>
          <button
            disabled={!generated}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button
            disabled={!generated}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1C1C1C] px-3 py-2 text-sm font-medium text-white transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [reportType, setReportType] = useState<ReportType>("orders");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [headerFilter, setHeaderFilter] = useState<HeaderFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  const filteredRows = useMemo(() => {
    const baseRows = reportDataset[reportType];
    return baseRows.filter((row) => {
      const matchSearch = !search || row.id.toLowerCase().includes(search.toLowerCase()) || row.name.toLowerCase().includes(search.toLowerCase());
      const rowRole = getRowRole(reportType);
      const matchRole = selectedRoles.length === 0 || selectedRoles.includes(rowRole);
      const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(row.status);
      const matchRegion = selectedRegions.length === 0 || selectedRegions.includes(row.region);
      const matchHeaderFilter =
        headerFilter === "all" ||
        (headerFilter === "role" && matchRole) ||
        (headerFilter === "status" && matchStatus) ||
        (headerFilter === "region" && matchRegion);
      const matchInactive = includeInactive || row.status !== "Suspended";
      return matchSearch && matchRole && matchStatus && matchRegion && matchHeaderFilter && matchInactive;
    });
  }, [reportType, search, selectedRoles, selectedStatuses, selectedRegions, includeInactive, headerFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (sortKey === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return sortDirection === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
  }, [filteredRows, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleFromList = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("desc");
  };

  const handleGenerateReport = () => {
    setGenerated(true);
    setLoading(true);
    setCurrentPage(1);
    window.setTimeout(() => setLoading(false), 900);
  };

  const savedReports = [
    { name: "Monthly Revenue Report", type: "revenue", updated: "2 hours ago" },
    { name: "Top Artisan Performance", type: "artisans", updated: "Yesterday" },
    { name: "Order Fulfillment Review", type: "orders", updated: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#1C1C1C]">
      <div className="min-h-screen">


        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-5 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={reportType}
                onChange={(event) => setReportType(event.target.value as ReportType)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#C6A75E]"
              >
                {reportTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value as DateRange)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#C6A75E]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="custom">Custom range</option>
              </select>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <select
                  value={headerFilter}
                  onChange={(event) => setHeaderFilter(event.target.value as HeaderFilter)}
                  className="rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-8 text-sm outline-none transition focus:border-[#C6A75E]"
                >
                  <option value="all">All filters</option>
                  <option value="role">Role focused</option>
                  <option value="status">Status focused</option>
                  <option value="region">Region focused</option>
                </select>
              </div>

              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C6A75E] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Generate Report
              </button>

              <button className="ml-auto rounded-xl border border-stone-200 bg-white p-2 text-stone-500 transition hover:text-stone-900">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="space-y-5">
            <ReportFilters
              selectedRoles={selectedRoles}
              selectedStatuses={selectedStatuses}
              selectedRegions={selectedRegions}
              includeInactive={includeInactive}
              search={search}
              onToggleRole={(value) => toggleFromList(value, selectedRoles, setSelectedRoles)}
              onToggleStatus={(value) => toggleFromList(value, selectedStatuses, setSelectedStatuses)}
              onToggleRegion={(value) => toggleFromList(value, selectedRegions, setSelectedRegions)}
              onToggleInactive={() => setIncludeInactive((prev) => !prev)}
              onSearch={setSearch}
            />

            <SummaryCards rows={sortedRows} reportType={reportType} enabled={generated && !loading} />

            <DataTable
              rows={paginatedRows}
              reportType={reportType}
              loading={loading}
              generated={generated}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
              <p>
                Page {currentPage} of {totalPages} - {sortedRows.length} records
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={!generated || currentPage === 1 || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={!generated || currentPage === totalPages || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ExportActions generated={generated && !loading} />

            <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Saved Reports</h3>
                <button className="text-xs font-semibold uppercase tracking-wider text-[#7A6024]">Manage templates</button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {savedReports.map((template) => (
                  <article key={template.name} className="rounded-xl border border-stone-200 p-3 transition hover:-translate-y-0.5 hover:shadow-sm">
                    <p className="font-medium">{template.name}</p>
                    <p className="mt-1 text-xs text-stone-500">Updated {template.updated}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setReportType(template.type as ReportType);
                          setGenerated(false);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-2 py-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" /> Quick load
                      </button>
                      <button
                        onClick={() => {
                          setReportType(template.type as ReportType);
                          handleGenerateReport();
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#C6A75E] px-2 py-1 text-xs font-semibold text-white"
                      >
                        <Download className="h-3.5 w-3.5" /> Re-run
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Shield,
  Clock,
  MoreHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import { User, UserStats, UserStatus } from "../types/auth";

const API_URL = "/api";

type StatusFilter = "all" | UserStatus;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

function safeLower(s?: string | null) {
  return (s || "").toLowerCase();
}

function statusPill(status: UserStatus) {
  switch (status) {
    case UserStatus.APPROVED:
      return {
        label: "Approved",
        cls: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/40",
      };
    case UserStatus.REJECTED:
      return {
        label: "Rejected",
        cls: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-800/40",
      };
    case UserStatus.PENDING:
    default:
      return {
        label: "Pending",
        cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800/40",
      };
  }
}

function rolePill(role?: string) {
  const isAdmin = role === "admin";
  return {
    label: role || "user",
    cls: isAdmin
      ? "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:ring-violet-800/40"
      : "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:ring-slate-700/60",
    icon: isAdmin ? Shield : Users,
  };
}

type Toast = { type: "success" | "error"; message: string } | null;

function ToastBanner({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div
      className={cx(
        "mb-5 rounded-xl px-4 py-3 ring-1 flex items-start gap-3",
        toast.type === "success"
          ? "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-800/40"
          : "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-200 dark:ring-rose-800/40"
      )}
    >
      <div className="mt-0.5">
        {toast.type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10 transition"
        aria-label="Close notification"
        title="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent = "blue",
}: {
  title: string;
  value: number;
  icon: any;
  accent?: "blue" | "amber" | "emerald" | "rose";
}) {
  const accentMap: Record<string, string> = {
    blue: "from-blue-500/15 to-blue-500/0 ring-blue-200 dark:ring-blue-900/40",
    amber:
      "from-amber-500/15 to-amber-500/0 ring-amber-200 dark:ring-amber-900/40",
    emerald:
      "from-emerald-500/15 to-emerald-500/0 ring-emerald-200 dark:ring-emerald-900/40",
    rose: "from-rose-500/15 to-rose-500/0 ring-rose-200 dark:ring-rose-900/40",
  };

  return (
    <div
      className={cx(
        "rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 p-5",
        accentMap[accent],
        "relative overflow-hidden"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br pointer-events-none" />
      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/5 dark:bg-white/10 p-3">
          <Icon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-3 items-center px-4 py-3">
      <div className="col-span-4">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="mt-2 h-3 w-56 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="col-span-2">
        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="col-span-2">
        <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="col-span-1">
        <div className="h-4 w-10 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="col-span-2">
        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="col-span-1 flex justify-end">
        <div className="h-8 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}

function UserDrawer({
  open,
  user,
  onClose,
  onApprove,
  onReject,
  onDelete,
  busy,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  if (!open) return null;

  const status = user ? statusPill(user.status) : null;
  const role = user ? rolePill(user.role) : null;
  const RoleIcon = role?.icon || Users;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              User details
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Review, approve, reject, or delete.
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title="Close"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {!user ? (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              No user selected.
            </div>
          ) : (
            <>
              <div className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-slate-900/5 dark:bg-white/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={cx(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          status?.cls
                        )}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {status?.label}
                      </span>

                      <span
                        className={cx(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          role?.cls
                        )}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />
                        {role?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                    Customers
                  </div>
                  <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {user.customerCount || 0}
                  </div>
                </div>
                <div className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                    Last activity
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {user.lastActive ? formatDate(user.lastActive) : "Never"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 p-4 space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                  Profile
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="text-slate-500 dark:text-slate-400">
                    Shop:
                  </span>{" "}
                  {user.shopName || "—"}
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="text-slate-500 dark:text-slate-400">
                    Phone:
                  </span>{" "}
                  {user.phoneNumber || "—"}
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="text-slate-500 dark:text-slate-400">
                    Registered:
                  </span>{" "}
                  {formatDate(user.createdAt)}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {user.status === UserStatus.PENDING && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={busy}
                      onClick={() => onApprove(user.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => onReject(user.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}

                {user.role !== "admin" && (
                  <button
                    disabled={busy}
                    onClick={() => onDelete(user.id)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete user
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { token } = useAuth();

  const [stats, setStats] = useState<UserStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);

  const [toast, setToast] = useState<Toast>(null);

  // Jira-style: quick “selected user” drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    fetchStats();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    let list = users;

    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter);

    if (searchTerm.trim()) {
      const q = safeLower(searchTerm.trim());
      list = list.filter(
        (u) => safeLower(u.name).includes(q) || safeLower(u.email).includes(q)
      );
    }

    return list;
  }, [users, searchTerm, statusFilter]);

  const pendingUsers = useMemo(
    () => users.filter((u) => u.status === UserStatus.PENDING),
    [users]
  );

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      setActionBusy(true);
      const res = await fetch(`${API_URL}/admin/users/${userId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "User approved successfully");
        await Promise.all([fetchStats(), fetchUsers()]);
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to approve user");
      }
    } catch {
      showToast("error", "Failed to approve user");
    } finally {
      setActionBusy(false);
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      setActionBusy(true);
      const res = await fetch(`${API_URL}/admin/users/${userId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "User rejected");
        await Promise.all([fetchStats(), fetchUsers()]);
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to reject user");
      }
    } catch {
      showToast("error", "Failed to reject user");
    } finally {
      setActionBusy(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user and all their data?")) return;

    try {
      setActionBusy(true);
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "User deleted successfully");
        await Promise.all([fetchStats(), fetchUsers()]);
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
          setDrawerOpen(false);
        }
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to delete user");
      }
    } catch {
      showToast("error", "Failed to delete user");
    } finally {
      setActionBusy(false);
    }
  };

  const openUser = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const onRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    const handleRefreshEvent = () => {
      onRefresh();
    };
    window.addEventListener('admin-refresh', handleRefreshEvent);
    return () => window.removeEventListener('admin-refresh', handleRefreshEvent);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <ToastBanner toast={toast} onClose={() => setToast(null)} />

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total users" value={stats.total} icon={Users} accent="blue" />
          <StatCard title="Pending" value={stats.pending} icon={UserPlus} accent="amber" />
          <StatCard title="Approved" value={stats.approved} icon={UserCheck} accent="emerald" />
          <StatCard title="Rejected" value={stats.rejected} icon={UserX} accent="rose" />
        </div>

        {/* Main content grid: left = list, right = pending queue (like a Jira side panel) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Users list */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-visible">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users (name or email)…"
                      className={cx(
                        "w-full rounded-xl bg-white dark:bg-slate-950",
                        "pl-9 pr-3 py-2 text-sm",
                        "ring-1 ring-slate-200 dark:ring-slate-800",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-200">
                      <Filter className="h-4 w-4" />
                      Status
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={cx(
                          "inline-flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-slate-950",
                          "px-4 py-2 text-sm font-semibold min-w-[140px]",
                          "ring-1 ring-slate-200 dark:ring-slate-800",
                          "hover:ring-slate-300 dark:hover:ring-slate-700",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500/60",
                          "transition-all",
                          dropdownOpen && "ring-2 ring-blue-500/60"
                        )}
                      >
                        <span className="text-slate-900 dark:text-white">
                          {statusFilter === "all" && "All"}
                          {statusFilter === UserStatus.PENDING && "Pending"}
                          {statusFilter === UserStatus.APPROVED && "Approved"}
                          {statusFilter === UserStatus.REJECTED && "Rejected"}
                        </span>
                        <ChevronDown className={cx(
                          "h-4 w-4 text-slate-400 transition-transform duration-200",
                          dropdownOpen && "rotate-180"
                        )} />
                      </button>

                      {dropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setDropdownOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setStatusFilter("all");
                                  setDropdownOpen(false);
                                }}
                                className={cx(
                                  "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                                  statusFilter === "all"
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span>All</span>
                                  {statusFilter === "all" && (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </div>
                              </button>
                              
                              <button
                                onClick={() => {
                                  setStatusFilter(UserStatus.PENDING);
                                  setDropdownOpen(false);
                                }}
                                className={cx(
                                  "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                                  statusFilter === UserStatus.PENDING
                                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5" />
                                    Pending
                                  </span>
                                  {statusFilter === UserStatus.PENDING && (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </div>
                              </button>

                              <button
                                onClick={() => {
                                  setStatusFilter(UserStatus.APPROVED);
                                  setDropdownOpen(false);
                                }}
                                className={cx(
                                  "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                                  statusFilter === UserStatus.APPROVED
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Approved
                                  </span>
                                  {statusFilter === UserStatus.APPROVED && (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </div>
                              </button>

                              <button
                                onClick={() => {
                                  setStatusFilter(UserStatus.REJECTED);
                                  setDropdownOpen(false);
                                }}
                                className={cx(
                                  "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                                  statusFilter === UserStatus.REJECTED
                                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <XCircle className="h-3.5 w-3.5" />
                                    Rejected
                                  </span>
                                  {statusFilter === UserStatus.REJECTED && (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
                      Showing <span className="font-semibold">{filteredUsers.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* “Jira table” list (card rows) */}
              <div className="divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden rounded-b-2xl">
                {loading ? (
                  <div className="p-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 dark:text-slate-400">
                    No users found.
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const st = statusPill(user.status);
                    const rl = rolePill(user.role);
                    const RoleIcon = rl.icon;

                    return (
                      <button
                        key={user.id}
                        onClick={() => openUser(user)}
                        className={cx(
                          "w-full text-left",
                          "px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        )}
                        title="Open user"
                      >
                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-12 md:col-span-5 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-xl bg-slate-900/5 dark:bg-white/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {user.email}
                                  {user.shopName ? ` • ${user.shopName}` : ""}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-6 md:col-span-2">
                            <span
                              className={cx(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                rl.cls
                              )}
                            >
                              <RoleIcon className="h-3.5 w-3.5" />
                              {rl.label}
                            </span>
                          </div>

                          <div className="col-span-6 md:col-span-2">
                            <span
                              className={cx(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                st.cls
                              )}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              {st.label}
                            </span>
                          </div>

                          <div className="col-span-6 md:col-span-1">
                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {user.customerCount || 0}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              customers
                            </div>
                          </div>

                          <div className="col-span-6 md:col-span-2">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {user.lastActive ? formatDate(user.lastActive) : "Never"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              last activity
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-0 flex justify-end md:hidden">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Pending queue (like Jira “work queue” panel) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Approval queue
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pending requests ({pendingUsers.length})
                  </div>
                </div>
                <div className="rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 text-xs font-bold">
                  {pendingUsers.length}
                </div>
              </div>

              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse"
                    />
                  ))}
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
                  No pending users right now.
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {pendingUsers.slice(0, 6).map((u) => (
                    <div
                      key={u.id}
                      className="rounded-2xl ring-1 ring-amber-200 dark:ring-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {u.name}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {u.email}
                          </div>
                          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            Registered: <span className="font-semibold">{formatDate(u.createdAt)}</span>
                          </div>
                          {u.shopName && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Shop: <span className="font-semibold">{u.shopName}</span>
                            </div>
                          )}
                          {u.phoneNumber && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Phone: <span className="font-semibold">{u.phoneNumber}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => openUser(u)}
                          className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                        >
                          Review
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          disabled={actionBusy}
                          onClick={() => approveUser(u.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          disabled={actionBusy}
                          onClick={() => rejectUser(u.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {pendingUsers.length > 6 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Showing first 6 pending users…
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <UserDrawer
        open={drawerOpen}
        user={selectedUser}
        busy={actionBusy}
        onClose={() => setDrawerOpen(false)}
        onApprove={approveUser}
        onReject={rejectUser}
        onDelete={deleteUser}
      />
    </div>
  );
}

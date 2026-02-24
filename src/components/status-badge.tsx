import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
}

const styles: Record<StatusBadgeProps["status"], string> = {
  pending: "bg-gray-200 text-gray-700",
  approved: "bg-gray-900 text-white",
  rejected: "bg-gray-400 text-white",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

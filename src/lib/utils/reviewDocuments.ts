import type { DocumentStatus } from "@/types/libranza";

export function getDocumentBlockFlags(status?: DocumentStatus | null) {
  return {
    isApproved: status === "APPROVED",
    isRejected: status === "REJECTED",
    isPending: status === "PENDING",

    canPickFile: status !== "APPROVED" && status !== "PENDING",
    canUploadNewFile: status !== "APPROVED",
    canReplaceFile: status === "REJECTED",
    canShowRejectedMessage: status === "REJECTED",
    canShowPendingMessage: status === "PENDING",
  };
}
export interface AuditTrailEvent {
  id: string;
  eventType: string;
  actorType: string;
  actorRole?: string | null;
  actorEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
  requestId?: string | null;
  documentHash?: string | null;
  previousEventHash?: string | null;
  eventHash: string;
  metadata?: Record<string, string> | null;
  createdAt: string;
}

export type AuditEvent = {
  id: string;
  eventType: string;
  actorType: string;
  actorRole?: string | null;
  actorEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
  requestId?: string | null;
  documentHash?: string | null;
  previousEventHash?: string | null;
  eventHash: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type AuditTrailResponse = {
  contract: {
    id: string;
    title: string;
    contractNumber?: string;
    contractType?: string;
    status: string;
  };
  summary: {
    totalEvents: number;
    firstEventAt?: string;
    lastEventAt?: string;
    lastEventHash?: string;
  };
  verification: {
    valid: boolean;
    reason?: string;
  };
  events: AuditEvent[];
};
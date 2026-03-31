type TraceId = string;

export function newTraceId(): TraceId {
  return crypto.randomUUID();
}

export type CollectedEvent = {
  event_time?: Date;
  widget_id: string;
  project_id?: string;
  session_id?: string;
  event_name: string;
  user_id?: string;
  url?: string;
  referrer?: string;
  user_agent?: string;
  ip?: string;
  payload?: Record<string, unknown>;
};

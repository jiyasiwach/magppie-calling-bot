// ============================================================================
// Domain types for the Magppie AI Calling Bot console.
// These mirror the shapes the real NestJS/Ozonetel backend is expected to
// return, so swapping mock-data.ts for real fetchers later touches only the
// data layer — not the components.
// ============================================================================

export type TenantId = 'magppie-living' | 'sunrooof'

export interface Tenant {
  id: TenantId
  name: string
  tagline: string
  /** brass | pine — accent used for the tenant chip */
  accent: 'brass' | 'pine'
}

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'kn'

export const LANGUAGE_LABEL: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  bn: 'Bengali',
  kn: 'Kannada',
}

export type Sentiment = 'calm' | 'frustrated' | 'urgent' | 'positive'

export type CallDirection = 'inbound' | 'outbound'

export type CallOutcome =
  | 'resolved'
  | 'escalated'
  | 'appointment'
  | 'lead'
  | 'no-answer'
  | 'dropped'
  | 'callback'

export type AgentStatus = 'healthy' | 'degraded' | 'down'

/** The six Magppie-specific tool-calling actions (§3.7 / §5.8). */
export type ToolAction =
  | 'create_lead'
  | 'create_ticket'
  | 'create_appointment'
  | 'warranty_lookup'
  | 'dealer_lookup'
  | 'order_status'

export const TOOL_ACTION_LABEL: Record<ToolAction, string> = {
  create_lead: 'Create Lead',
  create_ticket: 'Create Ticket',
  create_appointment: 'Create Appointment',
  warranty_lookup: 'Warranty Lookup',
  dealer_lookup: 'Dealer Lookup',
  order_status: 'Order Status',
}

export interface Agent {
  id: string
  name: string
  tenant: TenantId
  persona: string
  status: AgentStatus
  issue?: string
  languages: Language[]
  version: number
  liveCalls: number
  resolutionRate: number // 0–1
  avgLatencyMs: number
  enabledTools: ToolAction[]
}

export interface LiveCall {
  id: string
  tenant: TenantId
  agentId: string
  agentName: string
  customerPhone: string
  direction: CallDirection
  language: Language
  startedAt: number // epoch ms
  durationSec: number
  sentiment: Sentiment
  intent: string
  campaignId?: string
}

export interface TranscriptTurn {
  role: 'agent' | 'customer' | 'system'
  text: string
  atSec: number
  sentiment?: Sentiment
}

export interface ToolCall {
  action: ToolAction
  status: 'success' | 'failed'
  detail: string
  atSec: number
}

export interface ExplainStep {
  label: string
  detail: string
  confidence?: number // 0–1
  kbSnippet?: string
}

export interface Conversation {
  id: string
  tenant: TenantId
  agentId: string
  agentName: string
  customerName: string
  customerPhone: string
  direction: CallDirection
  language: Language
  startedAt: number
  durationSec: number
  outcome: CallOutcome
  sentiment: Sentiment
  sentimentScore: number // 0–100
  summary: string
  actionItems: string[]
  transcript: TranscriptTurn[]
  toolCalls: ToolCall[]
  explain: ExplainStep[]
  compliant: boolean
}

export type CampaignStatus = 'running' | 'paused' | 'scheduled' | 'completed'

export interface Campaign {
  id: string
  tenant: TenantId
  name: string
  status: CampaignStatus
  agentId: string
  language: Language
  placed: number
  remaining: number
  connectRate: number // 0–1
  conversionRate: number // 0–1
  spend: number // ₹
  projectedRecovery: number // ₹
  autoThrottle: boolean
  roiThreshold: number // ₹ recovered per ₹ spent
  funnel: { dialed: number; connected: number; completed: number; converted: number }
}

export type KbStatus = 'covered' | 'stale' | 'gap'

export interface KbDocument {
  id: string
  tenant: TenantId
  title: string
  source: string
  updatedAt: number
  status: KbStatus
  chunks: number
}

export interface KbGap {
  id: string
  topic: string
  question: string
  askedCount: number
  confidence: number // 0–1 the agent had when it failed
}

export interface Escalation {
  id: string
  tenant: TenantId
  reason: string
  customerName: string
  agentName: string
  at: number
  conversationId: string
}

export interface ComplianceRecord {
  id: string
  tenant: TenantId
  conversationId: string
  customerPhone: string
  at: number
  consentCaptured: boolean
  dndClear: boolean
  recordingDisclosed: boolean
  escalationReason?: string
  status: 'compliant' | 'flagged'
}

export type IntegrationKind = 'crm' | 'telephony' | 'whatsapp' | 'webhook'

export interface Integration {
  id: string
  name: string
  kind: IntegrationKind
  connected: boolean
  detail: string
}

export type Role = 'owner' | 'admin' | 'supervisor' | 'analyst' | 'agent'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  tenants: TenantId[]
  lastActive: number
}

export interface AgentVersion {
  version: number
  savedAt: number
  author: string
  note: string
  persona: string
}

/** A handoff hop for the Agent Handoff Visualizer (§4.1 / §5.11). */
export interface HandoffHop {
  channel: 'ai-voice' | 'whatsapp' | 'sms' | 'human'
  at: number
  reason: string
}

/** Customer 360 timeline event (§4.2 / §5.6). */
export interface CustomerEvent {
  id: string
  channel: 'voice' | 'whatsapp' | 'sms' | 'crm'
  at: number
  title: string
  detail: string
}

// ============================================================================
// Single mock-data source for the whole console (§6). Everything renders
// convincingly from here before the real API exists.
//
// SWAP-TO-REAL GUIDE
// ------------------
// Each exported `getX()` is a synchronous accessor over in-memory fixtures.
// To wire real APIs later, change each getX() into an async fetch against the
// NestJS backend (keep the same return shape from lib/types.ts) and update the
// hooks in lib/use-live.ts. No component imports fixtures directly — they call
// these accessors — so the blast radius of going live is this one file plus
// lib/use-live.ts.
// ============================================================================

import {
  Agent,
  AgentVersion,
  Campaign,
  ComplianceRecord,
  Conversation,
  CustomerEvent,
  Escalation,
  HandoffHop,
  Integration,
  KbDocument,
  KbGap,
  Language,
  LiveCall,
  TeamMember,
  Tenant,
} from './types'

// Fixed reference "now" (2026-07-15 16:00 IST) keeps SSR and client render
// identical — no hydration mismatch, and the demo reads the same every load.
export const NOW = 1752575400000
const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

export const TENANTS: Tenant[] = [
  {
    id: 'magppie-living',
    name: 'Magppie Living',
    tagline: 'Luxury modular kitchens',
    accent: 'pine',
  },
  {
    id: 'sunrooof',
    name: 'SUNROOOF',
    tagline: 'Solar & smart-home',
    accent: 'brass',
  },
]

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------
export const AGENTS: Agent[] = [
  {
    id: 'ag-aria',
    name: 'Aria — Sales Concierge',
    tenant: 'magppie-living',
    persona: 'Warm, unhurried design consultant who qualifies kitchen leads.',
    status: 'healthy',
    languages: ['en', 'hi'],
    version: 12,
    liveCalls: 4,
    resolutionRate: 0.82,
    avgLatencyMs: 610,
    enabledTools: ['create_lead', 'create_appointment', 'dealer_lookup'],
  },
  {
    id: 'ag-vikram',
    name: 'Vikram — Support Desk',
    tenant: 'magppie-living',
    persona: 'Calm, precise post-sales support for installations & warranty.',
    status: 'degraded',
    issue: 'TTS latency elevated (1.9s p95) on Hindi calls',
    languages: ['hi', 'en', 'mr'],
    version: 8,
    liveCalls: 3,
    resolutionRate: 0.74,
    avgLatencyMs: 1180,
    enabledTools: ['create_ticket', 'warranty_lookup', 'order_status'],
  },
  {
    id: 'ag-meera',
    name: 'Meera — Order Tracker',
    tenant: 'magppie-living',
    persona: 'Brisk, reassuring agent for delivery & order-status queries.',
    status: 'healthy',
    languages: ['en', 'ta', 'te'],
    version: 5,
    liveCalls: 2,
    resolutionRate: 0.88,
    avgLatencyMs: 540,
    enabledTools: ['order_status', 'create_ticket'],
  },
  {
    id: 'ag-surya',
    name: 'Surya — Solar Advisor',
    tenant: 'sunrooof',
    persona: 'Consultative solar-savings advisor booking rooftop surveys.',
    status: 'healthy',
    languages: ['en', 'hi', 'kn'],
    version: 9,
    liveCalls: 3,
    resolutionRate: 0.79,
    avgLatencyMs: 700,
    enabledTools: ['create_lead', 'create_appointment', 'dealer_lookup'],
  },
  {
    id: 'ag-nova',
    name: 'Nova — Renewal Bot',
    tenant: 'sunrooof',
    persona: 'Friendly AMC-renewal & payment-reminder outbound agent.',
    status: 'down',
    issue: 'Telephony trunk unreachable — Ozonetel SIP 503',
    languages: ['en', 'hi'],
    version: 4,
    liveCalls: 0,
    resolutionRate: 0.68,
    avgLatencyMs: 0,
    enabledTools: ['order_status', 'create_ticket'],
  },
]

// ---------------------------------------------------------------------------
// Live calls
// ---------------------------------------------------------------------------
const INTENTS = [
  'Kitchen quote request',
  'Warranty claim — chimney',
  'Delivery status',
  'Reschedule installation',
  'Dealer near Whitefield',
  'Solar savings estimate',
  'AMC renewal',
  'Modular cabinet finish query',
]

function makeLiveCalls(): LiveCall[] {
  const seed = [
    ['ag-aria', 'inbound', 'hi', 'calm', 0],
    ['ag-aria', 'outbound', 'en', 'positive', 1],
    ['ag-aria', 'inbound', 'hi', 'frustrated', 2],
    ['ag-aria', 'inbound', 'en', 'calm', 3],
    ['ag-vikram', 'inbound', 'hi', 'urgent', 4],
    ['ag-vikram', 'inbound', 'mr', 'frustrated', 5],
    ['ag-vikram', 'outbound', 'en', 'calm', 6],
    ['ag-meera', 'inbound', 'ta', 'positive', 7],
    ['ag-meera', 'inbound', 'en', 'calm', 3],
    ['ag-surya', 'outbound', 'hi', 'calm', 5],
    ['ag-surya', 'inbound', 'kn', 'positive', 0],
    ['ag-surya', 'outbound', 'en', 'frustrated', 6],
  ] as const

  return seed.map((s, i) => {
    const agent = AGENTS.find((a) => a.id === s[0])!
    const dur = 30 + ((i * 47) % 380)
    return {
      id: `call-${1000 + i}`,
      tenant: agent.tenant,
      agentId: agent.id,
      agentName: agent.name,
      customerPhone: `+9198${(760000 + i * 1234).toString().slice(0, 6)}`,
      direction: s[1] as LiveCall['direction'],
      language: s[2] as Language,
      startedAt: NOW - dur * 1000,
      durationSec: dur,
      sentiment: s[3] as LiveCall['sentiment'],
      intent: INTENTS[s[4] as number],
      campaignId: s[1] === 'outbound' ? 'cmp-201' : undefined,
    }
  })
}

export const LIVE_CALLS: LiveCall[] = makeLiveCalls()

// ---------------------------------------------------------------------------
// Conversations (call log)
// ---------------------------------------------------------------------------
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-9001',
    tenant: 'magppie-living',
    agentId: 'ag-aria',
    agentName: 'Aria — Sales Concierge',
    customerName: 'Rohan Mehta',
    customerPhone: '+919876543210',
    direction: 'inbound',
    language: 'hi',
    startedAt: NOW - 2 * HOUR,
    durationSec: 244,
    outcome: 'appointment',
    sentiment: 'positive',
    sentimentScore: 78,
    summary:
      'Customer enquired about an L-shaped modular kitchen for a 3BHK in Gurgaon. Aria qualified budget (₹4–6L), captured measurements, and booked a design-studio visit for Saturday 11 AM.',
    actionItems: [
      'Send design-studio confirmation on WhatsApp',
      'Share 3 L-shaped catalog references',
      'Assign designer: Kavya',
    ],
    transcript: [
      { role: 'agent', text: 'Namaste! Magppie Living se Aria bol rahi hoon. Aapki kitchen ke liye kaise madad karun?', atSec: 2, sentiment: 'calm' },
      { role: 'customer', text: 'Mujhe apne 3BHK ke liye modular kitchen chahiye, budget thoda flexible hai.', atSec: 9 },
      { role: 'agent', text: 'Bilkul. Kya aap L-shape ya U-shape prefer karenge? Aur approx area kitna hai?', atSec: 15, sentiment: 'calm' },
      { role: 'customer', text: 'L-shape. Area lagbhag 10 by 8 feet.', atSec: 22 },
      { role: 'system', text: 'Tool: create_lead → lead #LG-4821 created', atSec: 26 },
      { role: 'agent', text: 'Perfect. Main Saturday 11 baje ka studio visit book kar deti hoon — theek hai?', atSec: 48, sentiment: 'positive' },
      { role: 'customer', text: 'Haan, chalega.', atSec: 54 },
      { role: 'system', text: 'Tool: create_appointment → APT-2290 booked', atSec: 58 },
    ],
    toolCalls: [
      { action: 'create_lead', status: 'success', detail: 'Lead LG-4821 (₹4–6L, L-shape)', atSec: 26 },
      { action: 'create_appointment', status: 'success', detail: 'APT-2290 · Sat 11:00', atSec: 58 },
    ],
    explain: [
      { label: 'Intent detected', detail: 'new_kitchen_enquiry', confidence: 0.94 },
      { label: 'KB snippet used', detail: 'Modular kitchen size guide', confidence: 0.88, kbSnippet: 'L-shaped kitchens suit 10×8ft layouts; typical spend ₹4–7L incl. chimney & hob.' },
      { label: 'Tool decision', detail: 'create_appointment chosen because customer confirmed a slot and budget was captured.' },
    ],
    compliant: true,
  },
  {
    id: 'conv-9002',
    tenant: 'magppie-living',
    agentId: 'ag-vikram',
    agentName: 'Vikram — Support Desk',
    customerName: 'Anita Desai',
    customerPhone: '+919812345678',
    direction: 'inbound',
    language: 'hi',
    startedAt: NOW - 5 * HOUR,
    durationSec: 402,
    outcome: 'escalated',
    sentiment: 'frustrated',
    sentimentScore: 34,
    summary:
      'Chimney purchased 14 months ago is auto-cutting off. Warranty lookup showed cover lapsed by 2 months. Customer became upset; Vikram escalated to a human warranty specialist and logged a goodwill-review ticket.',
    actionItems: ['Human callback within 4h', 'Review goodwill warranty extension'],
    transcript: [
      { role: 'customer', text: 'Meri chimney do mahine se band ho rahi hai, warranty honi chahiye!', atSec: 4, sentiment: 'frustrated' },
      { role: 'agent', text: 'Main abhi warranty check karta hoon, ek second.', atSec: 10, sentiment: 'calm' },
      { role: 'system', text: 'Tool: warranty_lookup → expired 2 months ago', atSec: 16 },
      { role: 'agent', text: 'Aapki warranty do mahine pehle expire ho gayi hai. Main ise review ke liye bhej sakta hoon.', atSec: 24 },
      { role: 'customer', text: 'Yeh galat hai, main manager se baat karna chahti hoon.', atSec: 33, sentiment: 'urgent' },
      { role: 'system', text: 'Escalation triggered → human warranty specialist', atSec: 38 },
    ],
    toolCalls: [
      { action: 'warranty_lookup', status: 'success', detail: 'Chimney SN-77213 · expired 2mo', atSec: 16 },
      { action: 'create_ticket', status: 'success', detail: 'TKT-6610 goodwill review', atSec: 40 },
    ],
    explain: [
      { label: 'Intent detected', detail: 'warranty_claim', confidence: 0.91 },
      { label: 'KB snippet used', detail: 'Warranty policy — appliances', confidence: 0.83, kbSnippet: 'Chimney warranty 12 months standard; goodwill review allowed within 3 months of lapse.' },
      { label: 'Escalation reason', detail: 'Customer sentiment dropped to frustrated/urgent AND requested a human — both escalation rules matched.' },
    ],
    compliant: true,
  },
  {
    id: 'conv-9003',
    tenant: 'magppie-living',
    agentId: 'ag-meera',
    agentName: 'Meera — Order Tracker',
    customerName: 'Karthik Iyer',
    customerPhone: '+919845012345',
    direction: 'inbound',
    language: 'ta',
    startedAt: NOW - 26 * HOUR,
    durationSec: 132,
    outcome: 'resolved',
    sentiment: 'calm',
    sentimentScore: 71,
    summary:
      'Customer asked for delivery status of a cabinet order. Meera fetched order status (out for delivery, ETA tomorrow) and offered SMS tracking.',
    actionItems: ['SMS tracking link sent'],
    transcript: [
      { role: 'customer', text: 'Ended order status venum, en cabinet enga irukku?', atSec: 3 },
      { role: 'system', text: 'Tool: order_status → ORD-3391 out for delivery', atSec: 9 },
      { role: 'agent', text: 'Ungal order நாளை delivery aagum, tracking link SMS panren.', atSec: 15, sentiment: 'calm' },
    ],
    toolCalls: [{ action: 'order_status', status: 'success', detail: 'ORD-3391 · out for delivery', atSec: 9 }],
    explain: [
      { label: 'Intent detected', detail: 'order_status', confidence: 0.96 },
      { label: 'Tool decision', detail: 'order_status called directly; single-turn resolution, no escalation needed.' },
    ],
    compliant: true,
  },
  {
    id: 'conv-9004',
    tenant: 'sunrooof',
    agentId: 'ag-surya',
    agentName: 'Surya — Solar Advisor',
    customerName: 'Prakash Rao',
    customerPhone: '+919900112233',
    direction: 'outbound',
    language: 'hi',
    startedAt: NOW - 30 * HOUR,
    durationSec: 318,
    outcome: 'lead',
    sentiment: 'positive',
    sentimentScore: 74,
    summary:
      'Outbound solar-savings call. Surya estimated ₹2,400/mo savings for a 3kW rooftop, captured interest, and booked a free site survey.',
    actionItems: ['Site survey booked', 'Send savings PDF'],
    transcript: [
      { role: 'agent', text: 'Namaste, SUNROOOF se Surya. Aapke bijli bill par 40% tak bachat ho sakti hai.', atSec: 2, sentiment: 'calm' },
      { role: 'customer', text: 'Achha? Kitna kharcha aayega?', atSec: 11 },
      { role: 'system', text: 'Tool: create_lead → LG-7702', atSec: 30 },
    ],
    toolCalls: [
      { action: 'create_lead', status: 'success', detail: 'LG-7702 · 3kW rooftop', atSec: 30 },
      { action: 'create_appointment', status: 'success', detail: 'Survey · Thu 3PM', atSec: 210 },
    ],
    explain: [
      { label: 'Intent detected', detail: 'solar_interest', confidence: 0.87 },
      { label: 'KB snippet used', detail: 'Solar savings calculator', confidence: 0.8, kbSnippet: '3kW rooftop in Bengaluru saves ~₹2,200–2,600/mo at current tariffs.' },
    ],
    compliant: false,
  },
  {
    id: 'conv-9005',
    tenant: 'sunrooof',
    agentId: 'ag-nova',
    agentName: 'Nova — Renewal Bot',
    customerName: 'Sneha Kulkarni',
    customerPhone: '+919820055667',
    direction: 'outbound',
    language: 'en',
    startedAt: NOW - 3 * DAY,
    durationSec: 96,
    outcome: 'callback',
    sentiment: 'calm',
    sentimentScore: 60,
    summary:
      'AMC renewal reminder. Customer asked to be called back next week; Nova scheduled a callback and sent the renewal link on WhatsApp.',
    actionItems: ['Callback scheduled Mon', 'WhatsApp renewal link sent'],
    transcript: [
      { role: 'agent', text: 'Hi Sneha, your SUNROOOF AMC is due for renewal this month.', atSec: 2, sentiment: 'calm' },
      { role: 'customer', text: 'Can you call me next week? I’m travelling.', atSec: 12 },
    ],
    toolCalls: [{ action: 'create_ticket', status: 'success', detail: 'Callback CB-118 · Mon', atSec: 20 }],
    explain: [
      { label: 'Intent detected', detail: 'renewal_defer', confidence: 0.9 },
      { label: 'Handoff', detail: 'Switched voice → WhatsApp to deliver the renewal link the customer can act on later.' },
    ],
    compliant: true,
  },
]

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------
export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-201',
    tenant: 'magppie-living',
    name: 'Diwali Kitchen Upgrade',
    status: 'running',
    agentId: 'ag-aria',
    language: 'hi',
    placed: 3120,
    remaining: 1880,
    connectRate: 0.61,
    conversionRate: 0.14,
    spend: 48600,
    projectedRecovery: 214000,
    autoThrottle: true,
    roiThreshold: 3.0,
    funnel: { dialed: 3120, connected: 1903, completed: 1520, converted: 266 },
  },
  {
    id: 'cmp-202',
    tenant: 'magppie-living',
    name: 'Warranty Win-back',
    status: 'paused',
    agentId: 'ag-vikram',
    language: 'en',
    placed: 940,
    remaining: 260,
    connectRate: 0.55,
    conversionRate: 0.09,
    spend: 15200,
    projectedRecovery: 41000,
    autoThrottle: false,
    roiThreshold: 2.0,
    funnel: { dialed: 940, connected: 517, completed: 410, converted: 37 },
  },
  {
    id: 'cmp-203',
    tenant: 'sunrooof',
    name: 'Rooftop Solar Q3',
    status: 'running',
    agentId: 'ag-surya',
    language: 'hi',
    placed: 5400,
    remaining: 3600,
    connectRate: 0.58,
    conversionRate: 0.11,
    spend: 72300,
    projectedRecovery: 305000,
    autoThrottle: true,
    roiThreshold: 3.5,
    funnel: { dialed: 5400, connected: 3132, completed: 2510, converted: 276 },
  },
  {
    id: 'cmp-204',
    tenant: 'sunrooof',
    name: 'AMC Renewals — Jul',
    status: 'scheduled',
    agentId: 'ag-nova',
    language: 'en',
    placed: 0,
    remaining: 2100,
    connectRate: 0,
    conversionRate: 0,
    spend: 0,
    projectedRecovery: 98000,
    autoThrottle: true,
    roiThreshold: 2.5,
    funnel: { dialed: 0, connected: 0, completed: 0, converted: 0 },
  },
]

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------
export const KB_DOCS: KbDocument[] = [
  { id: 'kb-1', tenant: 'magppie-living', title: 'Modular kitchen size & layout guide', source: 'Drive / Catalog', updatedAt: NOW - 4 * DAY, status: 'covered', chunks: 42 },
  { id: 'kb-2', tenant: 'magppie-living', title: 'Warranty policy — appliances', source: 'Notion', updatedAt: NOW - 20 * DAY, status: 'stale', chunks: 18 },
  { id: 'kb-3', tenant: 'magppie-living', title: 'Finish & material catalog 2026', source: 'Drive / Catalog', updatedAt: NOW - 2 * DAY, status: 'covered', chunks: 96 },
  { id: 'kb-4', tenant: 'magppie-living', title: 'Dealer & studio locations', source: 'Sheets', updatedAt: NOW - 9 * DAY, status: 'covered', chunks: 30 },
  { id: 'kb-5', tenant: 'sunrooof', title: 'Solar savings & subsidy FAQ', source: 'Notion', updatedAt: NOW - 6 * DAY, status: 'covered', chunks: 51 },
  { id: 'kb-6', tenant: 'sunrooof', title: 'AMC & maintenance terms', source: 'Drive', updatedAt: NOW - 40 * DAY, status: 'gap', chunks: 12 },
]

export const KB_GAPS: KbGap[] = [
  { id: 'gap-1', topic: 'Financing', question: 'Do you offer EMI / no-cost EMI on kitchens above ₹5L?', askedCount: 34, confidence: 0.31 },
  { id: 'gap-2', topic: 'Warranty', question: 'Is the chimney motor covered separately from the body?', askedCount: 27, confidence: 0.28 },
  { id: 'gap-3', topic: 'Installation', question: 'What is the installation timeline during festival season?', askedCount: 19, confidence: 0.4 },
  { id: 'gap-4', topic: 'Solar subsidy', question: 'How much is the 2026 PM Surya Ghar subsidy for 3kW?', askedCount: 41, confidence: 0.22 },
  { id: 'gap-5', topic: 'Service area', question: 'Do you install solar in Tier-2 cities like Mysuru?', askedCount: 12, confidence: 0.45 },
]

// ---------------------------------------------------------------------------
// Escalations
// ---------------------------------------------------------------------------
export const ESCALATIONS: Escalation[] = [
  { id: 'esc-1', tenant: 'magppie-living', reason: 'Customer requested human + frustrated', customerName: 'Anita Desai', agentName: 'Vikram', at: NOW - 5 * HOUR, conversationId: 'conv-9002' },
  { id: 'esc-2', tenant: 'magppie-living', reason: 'Pricing dispute over ₹80k quote', customerName: 'Imran Sheikh', agentName: 'Aria', at: NOW - 6 * HOUR, conversationId: 'conv-9001' },
  { id: 'esc-3', tenant: 'sunrooof', reason: 'Subsidy amount not in KB', customerName: 'Deepa Nair', agentName: 'Surya', at: NOW - 8 * HOUR, conversationId: 'conv-9004' },
  { id: 'esc-4', tenant: 'magppie-living', reason: 'Repeat caller — 3rd contact', customerName: 'Sanjay Gupta', agentName: 'Meera', at: NOW - 30 * HOUR, conversationId: 'conv-9003' },
]

// ---------------------------------------------------------------------------
// Compliance
// ---------------------------------------------------------------------------
export const COMPLIANCE: ComplianceRecord[] = CONVERSATIONS.map((c, i) => ({
  id: `cmp-log-${i + 1}`,
  tenant: c.tenant,
  conversationId: c.id,
  customerPhone: c.customerPhone,
  at: c.startedAt,
  consentCaptured: c.compliant,
  dndClear: c.compliant || c.direction === 'inbound',
  recordingDisclosed: c.compliant,
  escalationReason: c.outcome === 'escalated' ? 'Human handoff' : undefined,
  status: c.compliant ? 'compliant' : 'flagged',
}))

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------
export const INTEGRATIONS: Integration[] = [
  { id: 'int-zoho', name: 'Zoho CRM', kind: 'crm', connected: true, detail: 'Leads & tickets synced · 2 min ago' },
  { id: 'int-ozonetel', name: 'Ozonetel', kind: 'telephony', connected: true, detail: 'SIP trunk · 12 concurrent channels' },
  { id: 'int-whatsapp', name: 'WhatsApp Business', kind: 'whatsapp', connected: true, detail: 'Template msgs approved · 4 flows' },
  { id: 'int-webhook', name: 'Ops Webhook', kind: 'webhook', connected: false, detail: 'Not configured' },
  { id: 'int-salesforce', name: 'Salesforce', kind: 'crm', connected: false, detail: 'Available' },
  { id: 'int-slack', name: 'Slack Alerts', kind: 'webhook', connected: true, detail: '#voice-escalations' },
]

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------
export const TEAM: TeamMember[] = [
  { id: 'u-1', name: 'Priya Sharma', email: 'priya@mymagppie.com', role: 'owner', tenants: ['magppie-living', 'sunrooof'], lastActive: NOW - 10 * MIN },
  { id: 'u-2', name: 'Arjun Nair', email: 'arjun@mymagppie.com', role: 'admin', tenants: ['magppie-living'], lastActive: NOW - 40 * MIN },
  { id: 'u-3', name: 'Fatima Khan', email: 'fatima@mymagppie.com', role: 'supervisor', tenants: ['magppie-living', 'sunrooof'], lastActive: NOW - 2 * HOUR },
  { id: 'u-4', name: 'Ravi Teja', email: 'ravi@sunrooof.com', role: 'analyst', tenants: ['sunrooof'], lastActive: NOW - 1 * DAY },
  { id: 'u-5', name: 'Neha Joshi', email: 'neha@mymagppie.com', role: 'agent', tenants: ['magppie-living'], lastActive: NOW - 3 * HOUR },
]

// ---------------------------------------------------------------------------
// Agent version history (§3.3 / §5.2)
// ---------------------------------------------------------------------------
export const AGENT_VERSIONS: Record<string, AgentVersion[]> = {
  'ag-aria': [
    { version: 12, savedAt: NOW - 2 * DAY, author: 'Arjun Nair', note: 'Softened opening line, added budget-qualify step', persona: 'Warm, unhurried design consultant who qualifies kitchen leads.' },
    { version: 11, savedAt: NOW - 9 * DAY, author: 'Priya Sharma', note: 'Enabled create_appointment tool', persona: 'Warm design consultant who qualifies kitchen leads.' },
    { version: 10, savedAt: NOW - 21 * DAY, author: 'Arjun Nair', note: 'Hindi persona tuning', persona: 'Friendly consultant for kitchen leads.' },
  ],
}

// ---------------------------------------------------------------------------
// Handoff + Customer 360 (§4)
// ---------------------------------------------------------------------------
export const HANDOFF_SAMPLE: HandoffHop[] = [
  { channel: 'ai-voice', at: NOW - 5 * HOUR, reason: 'Inbound warranty call answered by Vikram' },
  { channel: 'whatsapp', at: NOW - 5 * HOUR + 6 * MIN, reason: 'Sent warranty policy PDF for reference' },
  { channel: 'human', at: NOW - 5 * HOUR + 9 * MIN, reason: 'Escalated: frustrated + human requested' },
]

export const CUSTOMER_360: CustomerEvent[] = [
  { id: 'ce-1', channel: 'voice', at: NOW - 5 * HOUR, title: 'Inbound call — warranty claim', detail: 'Chimney auto-cutoff, warranty lapsed 2mo' },
  { id: 'ce-2', channel: 'whatsapp', at: NOW - 5 * HOUR + 6 * MIN, title: 'Sent warranty policy', detail: 'PDF delivered, read' },
  { id: 'ce-3', channel: 'crm', at: NOW - 5 * HOUR + 9 * MIN, title: 'Ticket TKT-6610', detail: 'Goodwill review opened' },
  { id: 'ce-4', channel: 'sms', at: NOW - 4 * HOUR, title: 'Callback SMS', detail: 'Human callback confirmed within 4h' },
  { id: 'ce-5', channel: 'voice', at: NOW - 40 * DAY, title: 'Purchase call', detail: 'Bought chimney + hob combo' },
]

// ---------------------------------------------------------------------------
// Time-series & aggregates for charts
// ---------------------------------------------------------------------------
/** Last-N-days inbound/outbound call volume. */
export function getCallVolume(days: number, tenant?: string) {
  const base = tenant === 'sunrooof' ? 180 : 320
  return Array.from({ length: days }, (_, i) => {
    const d = days - 1 - i
    const wobble = Math.sin(i / 2) * 40 + Math.cos(i / 3) * 25
    return {
      date: new Date(NOW - d * DAY).toISOString().slice(5, 10),
      inbound: Math.round(base + wobble + (i % 4) * 12),
      outbound: Math.round(base * 0.7 + wobble * 0.6 + (i % 3) * 18),
    }
  })
}

/** Outcome-by-hour heatmap matrix (§3.7). */
export function getHourHeatmap() {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8am–7pm
  return hours.map((h) => ({
    hour: `${h}:00`,
    value: Math.round(40 + Math.sin((h - 8) / 2) * 30 + ((h * 7) % 20)),
  }))
}

/** Tool-action reliability for the Action Console (§3.7 / §5.8). */
export function getToolReliability(tenant?: string) {
  const rows = [
    { action: 'create_lead', calls: 1820, success: 0.97 },
    { action: 'create_ticket', calls: 940, success: 0.99 },
    { action: 'create_appointment', calls: 610, success: 0.94 },
    { action: 'warranty_lookup', calls: 430, success: 0.88 },
    { action: 'dealer_lookup', calls: 380, success: 0.96 },
    { action: 'order_status', calls: 1240, success: 0.99 },
  ]
  const mult = tenant === 'sunrooof' ? 0.6 : 1
  return rows.map((r) => ({
    ...r,
    calls: Math.round(r.calls * mult),
    failed: Math.round(r.calls * mult * (1 - r.success)),
  }))
}

/** KPI headline numbers for the Overview command center. */
export function getKpis(tenant?: string) {
  const isSun = tenant === 'sunrooof'
  return {
    callsToday: isSun ? 640 : 1284,
    callsTrend: isSun ? 6.2 : 8.4,
    resolutionRate: isSun ? 0.76 : 0.83,
    resolutionTrend: isSun ? 1.1 : 2.3,
    avgLatencyMs: isSun ? 720 : 640,
    latencyTrend: isSun ? -3.5 : -5.1,
    costSaved: isSun ? 184000 : 412000,
    costTrend: isSun ? 11.0 : 14.2,
  }
}

/** Sparkline series for KPI cards. */
export function getSparkline(seed: number) {
  return Array.from({ length: 14 }, (_, i) => ({
    x: i,
    y: 50 + Math.sin((i + seed) / 2) * 18 + Math.cos((i + seed) / 3) * 10 + (i % 3) * 4,
  }))
}

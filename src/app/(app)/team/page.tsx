'use client'

import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/misc'
import { TENANTS } from '@/lib/mock-data'
import { useTeam } from '@/lib/data'
import type { Role } from '@/lib/types'
import { toast } from '@/lib/toast'
import { UserPlus } from 'lucide-react'

const ROLE_TONE: Record<Role, 'pine' | 'brass' | 'success' | 'neutral'> = {
  owner: 'pine',
  admin: 'brass',
  supervisor: 'success',
  analyst: 'neutral',
  agent: 'neutral',
}

export default function TeamPage() {
  const team = useTeam()
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team & Roles"
        subtitle="Users, permissions and brand access. Switch brands from the top bar without logging out."
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.info('Invite a member', 'Enter an email and pick a role and brand access.')}
        >
          <UserPlus className="h-4 w-4" /> Invite member
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-ink-muted">
                  <th className="p-3 font-medium">Member</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Brand access</th>
                  <th className="p-3 text-right font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {team.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-ink-muted">
                      Just you so far — invite teammates and assign roles & brand access.
                    </td>
                  </tr>
                )}
                {team.map((m) => (
                  <tr key={m.id} className="border-b border-border/60 last:border-0 hover:bg-ink/[0.02]">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary/15 text-xs font-semibold text-accent-primary">
                          {m.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                        <div>
                          <p className="font-medium text-ink">{m.name}</p>
                          <p className="text-xs text-ink-muted">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3"><Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge></td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {m.tenants.map((t) => (
                          <Badge key={t} tone="neutral">
                            {TENANTS.find((x) => x.id === t)?.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="tabular p-3 text-right text-ink-muted">
                      {formatDistanceToNow(m.lastActive, { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

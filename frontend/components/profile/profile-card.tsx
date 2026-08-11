import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { UserProfile } from "@/types/user"

export function ProfileCard({ user }: { user: UserProfile }) {
  const stats = [
    { value: user.followingCount, label: "Дагаж буй" },
    { value: user.purchasesCount, label: "Худалдан авалт" },
    { value: user.savedShowsCount, label: "Хадгалсан шоу" },
  ]

  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="flex items-start gap-4">
        <Avatar className="size-16">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback className="bg-primary text-xl text-primary-foreground">
            {user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight">{user.username}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {user.memberSince}-оос хойш гишүүн
          </p>

          <dl className="mt-3 flex gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-sm font-semibold">{s.value}</dd>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </dl>
        </div>

        <Button variant="outline" size="sm">
          Профайл засах
        </Button>
      </div>
    </section>
  )
}

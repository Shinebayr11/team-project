"use client"

import React, { useMemo, useState } from "react"
import { useStore, parsePrice } from "@/store"
import { BalanceCard } from "@/components/wallet/BalanceCard"
import { TopUpPanel, CreditPack } from "@/components/wallet/TopUpPanel"
import {
  TransactionList,
  WalletTransaction,
} from "@/components/wallet/TransactionList"

const PACKS: CreditPack[] = [
  { amount: 5000, price: "₮5,000", bonus: 0 },
  { amount: 15000, price: "₮15,000", bonus: 1000 },
  { amount: 50000, price: "₮50,000", bonus: 5000 },
  { amount: 100000, price: "₮100,000", bonus: 15000 },
]

export const Wallet: React.FC = () => {
  const { creditsLabel, topUp, state, addToast } = useStore()
  const [selectedPack, setSelectedPack] = useState(PACKS[1].amount)

  const transactions = useMemo<WalletTransaction[]>(
    () =>
      state.purchases.map((p) => ({
        id: p.id,
        title: `Purchased: ${p.title}`,
        amount: -(parsePrice(p.price) * (p.qty || 1)),
        date: p.date,
        status: "completed",
      })),
    [state.purchases]
  )

  const handleTopUp = () => {
    topUp(selectedPack)
    addToast(
      `Successfully added ₮${selectedPack.toLocaleString()} to your wallet.`
    )
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10">
      <div className="mb-10">
        <h1 className="mb-2 text-[32px] font-[800] tracking-tight text-[var(--wn-ink)]">
          Wallet
        </h1>
        <p className="text-[16px] font-[500] text-[var(--wn-ink-3)]">
          Manage your balance and view transaction history.
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[420px]">
          <BalanceCard balanceLabel={creditsLabel()} />
          <TopUpPanel
            packs={PACKS}
            selected={selectedPack}
            onSelect={setSelectedPack}
            onTopUp={handleTopUp}
          />
        </div>

        <div className="flex flex-1 flex-col">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  )
}

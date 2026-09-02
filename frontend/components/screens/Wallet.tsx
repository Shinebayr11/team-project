"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useStore, parsePrice } from "@/store"
import { useApiClient } from "@/hooks/useApiClient"
import { BalanceCard } from "@/components/wallet/BalanceCard"
import { TopUpPanel, CreditPack } from "@/components/wallet/TopUpPanel"
import {
  TransactionList,
  WalletTransaction,
} from "@/components/wallet/TransactionList"

type ServerWallet = { coin_balance: number } | null

const COIN_TOPUP_AMOUNT = 100

const PACKS: CreditPack[] = [
  { amount: 5000, price: "₮5,000", bonus: 0 },
  { amount: 15000, price: "₮15,000", bonus: 1000 },
  { amount: 50000, price: "₮50,000", bonus: 5000 },
  { amount: 100000, price: "₮100,000", bonus: 15000 },
]

export const Wallet: React.FC = () => {
  const { creditsLabel, topUp, state, addToast } = useStore()
  const [selectedPack, setSelectedPack] = useState(PACKS[1].amount)
  const { callApi } = useApiClient()
  const [serverWallet, setServerWallet] = useState<ServerWallet>(null)
  const [serverWalletLoading, setServerWalletLoading] = useState(true)

  useEffect(() => {
    callApi<{ data: ServerWallet }>("/api/wallet")
      .then((res) => setServerWallet(res.data))
      .catch((error) => console.error("Failed to load server wallet:", error))
      .finally(() => setServerWalletLoading(false))
  }, [callApi])

  const handleServerTopUp = () => {
    callApi<{ data: { coin_balance: number } }>("/api/wallet/topup", {
      method: "PATCH",
      body: JSON.stringify({ amount: COIN_TOPUP_AMOUNT }),
    })
      .then((res) => {
        setServerWallet(res.data)
        addToast(`Server balance +${COIN_TOPUP_AMOUNT} coins.`)
      })
      .catch((error) => console.error("Failed to top up server wallet:", error))
  }

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
    <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:py-10">
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

          <div className="rounded-[24px] border border-[var(--wn-line)] p-6">
            <div className="mb-1 text-[13px] font-[600] uppercase tracking-wider text-[var(--wn-ink-3)]">
              Server balance (MongoDB)
            </div>
            <div className="mb-4 text-[28px] font-[800] text-[var(--wn-ink)]">
              {serverWalletLoading
                ? "..."
                : `${(serverWallet?.coin_balance ?? 0).toLocaleString()} coins`}
            </div>
            <button
              type="button"
              onClick={handleServerTopUp}
              className="w-full rounded-[12px] bg-[var(--wn-accent)] py-3 text-[14px] font-[700] text-white"
            >
              Top up (server) +{COIN_TOPUP_AMOUNT}
            </button>
          </div>

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

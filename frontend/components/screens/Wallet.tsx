"use client"

import React, { useMemo, useState } from "react"
import { useStore, parsePrice } from "@/store"
import { useApiClient } from "@/hooks/useApiClient"
import { useWallet } from "@/hooks/useWallet"
import { ApiError } from "@/lib/api"
import { BackButton } from "@/components/ui/BackButton"
import { BalanceCard } from "@/components/wallet/BalanceCard"
import { TopUpPanel, CreditPack } from "@/components/wallet/TopUpPanel"
import {
  TransactionList,
  WalletTransaction,
} from "@/components/wallet/TransactionList"
import {
  PaymentIntent,
  TopUpPaymentModal,
} from "@/components/wallet/TopUpPaymentModal"

const PACKS: CreditPack[] = [
  { amount: 5000, price: "₮5,000", bonus: 0 },
  { amount: 15000, price: "₮15,000", bonus: 1000 },
  { amount: 50000, price: "₮50,000", bonus: 5000 },
  { amount: 100000, price: "₮100,000", bonus: 15000 },
]

export const Wallet: React.FC = () => {
  const { state, addToast } = useStore()
  const [selectedPack, setSelectedPack] = useState(PACKS[1].amount)
  const { callApi } = useApiClient()
  const { available, loading: walletLoading, refresh: refreshWallet } = useWallet()
  const [submitting, setSubmitting] = useState(false)

  // Профайлын худалдан авалтын түүх хараахан бодит `CoinTransaction`-с
  // уншдаггүй — одоогоор зөвхөн энэ хөтчийн mock захиалгын жагсаалт.
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

  // Банкны QR цонх. Дүнг СЕРВЕР багцаас нь тооцно — энд зөвхөн аль багц
  // сонгосныг л явуулна.
  const [payment, setPayment] = useState<{
    intent: PaymentIntent
    creditAmount: number
  } | null>(null)

  const handleTopUp = async () => {
    setSubmitting(true)
    try {
      const { data } = await callApi<{
        data: { payment_intent: PaymentIntent; credit_amount: number }
      }>("/api/payment/topup", {
        method: "POST",
        body: JSON.stringify({ amount: selectedPack }),
      })
      setPayment({ intent: data.payment_intent, creditAmount: data.credit_amount })
    } catch (error) {
      addToast(error instanceof ApiError ? error.message : "Цэнэглэхэд алдаа гарлаа.")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaid = async () => {
    const amount = payment?.creditAmount ?? 0
    setPayment(null)
    await refreshWallet()
    addToast(`Хэтэвчинд ₮${amount.toLocaleString()} амжилттай нэмэгдлээ.`)
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:py-10">
      <BackButton className="mb-6" fallback="/home" />

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
          <BalanceCard balanceLabel={walletLoading ? "…" : available.toLocaleString()} />

          <TopUpPanel
            packs={PACKS}
            selected={selectedPack}
            onSelect={setSelectedPack}
            onTopUp={submitting ? () => {} : handleTopUp}
          />
        </div>

        <div className="flex flex-1 flex-col">
          <TransactionList transactions={transactions} />
        </div>
      </div>

      {payment && (
        <TopUpPaymentModal
          intent={payment.intent}
          creditAmount={payment.creditAmount}
          onClose={() => setPayment(null)}
          onPaid={handlePaid}
        />
      )}
    </div>
  )
}

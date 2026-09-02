"use client"

import React from "react"
import { Radio, AlertCircle, CheckCircle } from "lucide-react"

interface StreamingStatusBarProps {
  liveStatus?: string
  error?: string
  onStartClick?: () => void
  onStopClick?: () => void
}

export const StreamingStatusBar: React.FC<StreamingStatusBarProps> = ({
  liveStatus = "idle",
  error,
  onStartClick,
  onStopClick,
}) => {
  const isLive = liveStatus === "streaming" || liveStatus === "ingress_created"

  return (
    <div className="bg-gradient-to-r from-[var(--wn-surface-2)] to-[var(--wn-surface-3)] border-b border-[var(--wn-line)] p-4">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto">
        {/* Status */}
        <div className="flex items-center gap-3">
          {isLive ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-semibold text-[var(--wn-ink)]">🔴 LIVE</span>
              </div>
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600 font-semibold">{error}</span>
            </>
          ) : (
            <>
              <Radio className="w-5 h-5 text-[var(--wn-ink-3)]" />
              <span className="text-sm text-[var(--wn-ink-3)] font-semibold">Not Broadcasting</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isLive && onStartClick && (
            <button
              onClick={onStartClick}
              className="px-4 py-2 bg-[var(--wn-accent)] text-white rounded-lg font-semibold hover:bg-[var(--wn-accent-hover)] transition-colors text-sm"
            >
              📡 Start Streaming
            </button>
          )}

          {isLive && onStopClick && (
            <button
              onClick={onStopClick}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
            >
              ⏹️ Stop Streaming
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Copy, Check, AlertCircle, Loader } from "lucide-react"

interface ObsSetupWizardProps {
  showId: string
  sellerName: string
  onComplete?: () => void
  onClose?: () => void
}

export const ObsSetupWizard: React.FC<ObsSetupWizardProps> = ({
  showId,
  sellerName,
  onComplete,
  onClose,
}) => {
  const { getToken } = useAuth()
  const [step, setStep] = useState<"loading" | "display" | "connected" | "error">("loading")
  const [ingressUrl, setIngressUrl] = useState("")
  const [streamKey, setStreamKey] = useState("")
  const [roomName, setRoomName] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<"url" | "key" | null>(null)

  // Create ingress on mount
  useEffect(() => {
    const createIngress = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`/api/streaming/${showId}/ingress/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ showId, sellerName }),
        })

        if (!res.ok) throw new Error("Failed to create ingress")

        const data = await res.json()
        setIngressUrl(data.ingressUrl)
        setStreamKey(data.streamKey)
        setRoomName(data.roomName)
        setStep("display")

        // Start polling for connection
        pollStatus(data.ingressId)
      } catch (err: any) {
        console.error("CreateIngress error:", err)
        setError(err.message || "Failed to create ingress")
        setStep("error")
      }
    }

    createIngress()
  }, [showId, sellerName, getToken])

  // Poll ingress status
  const pollStatus = async (ingressId: string) => {
    const token = await getToken()
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/streaming/${showId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) return

        const data = await res.json()

        // Check if OBS is connected (ingress status = streaming or active)
        if (data.liveStatus === "streaming" || data.liveStatus === "connected") {
          setStep("connected")
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 2000)
        }
      } catch (err) {
        console.error("Poll status error:", err)
      }
    }, 2000) // Poll every 2 seconds

    // Cleanup after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000)
  }

  const copyToClipboard = (text: string, type: "url" | "key") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--wn-ink)] mb-1">📡 OBS Setup</h2>
          <p className="text-sm text-[var(--wn-ink-3)]">Copy these settings to OBS</p>
        </div>

        {/* Loading State */}
        {step === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader className="w-8 h-8 animate-spin text-[var(--wn-accent)]" />
            <p className="text-sm text-[var(--wn-ink-3)]">Generating stream endpoint...</p>
          </div>
        )}

        {/* Display State */}
        {step === "display" && (
          <div className="space-y-4">
            {/* Server URL */}
            <div>
              <label className="block text-xs font-bold text-[var(--wn-ink-2)] mb-2 uppercase">
                Server (RTMP URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ingressUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[var(--wn-surface-2)] rounded-lg text-sm font-mono border border-[var(--wn-line)] text-[var(--wn-ink)]"
                />
                <button
                  onClick={() => copyToClipboard(ingressUrl, "url")}
                  className="p-2 hover:bg-[var(--wn-surface-2)] rounded-lg transition-colors"
                  title="Copy server URL"
                >
                  {copied === "url" ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-[var(--wn-ink-3)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Stream Key */}
            <div>
              <label className="block text-xs font-bold text-[var(--wn-ink-2)] mb-2 uppercase">
                Stream Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={streamKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[var(--wn-surface-2)] rounded-lg text-sm font-mono border border-[var(--wn-line)] text-[var(--wn-ink)]"
                />
                <button
                  onClick={() => copyToClipboard(streamKey, "key")}
                  className="p-2 hover:bg-[var(--wn-surface-2)] rounded-lg transition-colors"
                  title="Copy stream key"
                >
                  {copied === "key" ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-[var(--wn-ink-3)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[var(--wn-surface-2)] rounded-lg p-4 text-sm">
              <p className="font-semibold text-[var(--wn-ink)] mb-2">In OBS:</p>
              <ol className="text-[var(--wn-ink-3)] space-y-1 text-xs">
                <li>1. Settings → Stream</li>
                <li>2. Service: RTMP Custom</li>
                <li>3. Paste Server URL</li>
                <li>4. Paste Stream Key</li>
                <li>5. Click "Start Streaming"</li>
              </ol>
            </div>

            {/* Status */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--wn-surface-2)] rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[var(--wn-ink-2)]">Waiting for OBS...</span>
              </div>
            </div>
          </div>
        )}

        {/* Connected State */}
        {step === "connected" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--wn-ink)]">✅ OBS Connected!</p>
              <p className="text-sm text-[var(--wn-ink-3)] mt-1">Live streaming started</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {step === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">Error</p>
              <p className="text-sm text-[var(--wn-ink-3)] mt-1">{error}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Footer */}
        {step === "display" && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[var(--wn-surface-2)] text-[var(--wn-ink)] rounded-lg font-semibold hover:bg-[var(--wn-surface-3)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => window.open("https://obsproject.com", "_blank")}
              className="flex-1 px-4 py-2 bg-[var(--wn-accent)] text-white rounded-lg font-semibold hover:bg-[var(--wn-accent-hover)] transition-colors"
            >
              Open OBS
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

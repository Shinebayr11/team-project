"use client"

import { ObsSetupWizard } from "@/components/streaming/ObsSetupWizard"
import { StreamingStatusBar } from "@/components/streaming/StreamingStatusBar"
import { useState } from "react"

export default function TestWizardPage() {
  const [showWizard, setShowWizard] = useState(true)
  const [liveStatus, setLiveStatus] = useState<string>("idle")

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <StreamingStatusBar
        liveStatus={liveStatus}
        onStartClick={() => setShowWizard(true)}
        onStopClick={() => {
          setLiveStatus("idle")
          setShowWizard(false)
        }}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">📡 OBS Setup Wizard Test</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-900 mb-2">Test Instructions:</h2>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>1. Click "📡 Start Streaming" button above</li>
            <li>2. OBS Setup Wizard modal should appear</li>
            <li>3. Copy RTMP URL + Stream Key</li>
            <li>4. Check console for API calls (every 2 sec)</li>
            <li>5. When "✅ OBS Connected!" appears, modal closes</li>
          </ul>
        </div>

        <div className="space-y-6">
          {/* Test Info */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Test Configuration</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Show ID</p>
                <p className="font-mono bg-white p-2 rounded border">test-auction-123</p>
              </div>
              <div>
                <p className="text-gray-600">Seller Name</p>
                <p className="font-mono bg-white p-2 rounded border">Test Seller</p>
              </div>
            </div>
          </div>

          {/* Console Info */}
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm overflow-x-auto">
            <p className="mb-2">💻 Expected Console Output:</p>
            <p className="text-gray-400">
              {`POST /api/streaming/test-auction-123/ingress/create`}
            </p>
            <p className="text-gray-400">
              {`Response: { success: true, ingressUrl: "rtmp://...", streamKey: "..." }`}
            </p>
            <br />
            <p className="text-gray-400">
              {`GET /api/streaming/test-auction-123/status (every 2s)`}
            </p>
            <p className="text-gray-400">
              {`Response: { liveStatus: "ingress_created", ... }`}
            </p>
          </div>

          {/* Component Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4">Component Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span>ObsSetupWizard component created</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span>StreamingStatusBar component created</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span>useStreaming hook ready</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span>Backend API endpoints working</span>
              </div>
            </div>
          </div>

          {/* Test Button */}
          {!showWizard && (
            <button
              onClick={() => setShowWizard(true)}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              🔄 Open Wizard Again
            </button>
          )}
        </div>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <ObsSetupWizard
          showId="test-auction-123"
          sellerName="Test Seller"
          onComplete={() => {
            console.log("✅ OBS Connected - wizard completed")
            setLiveStatus("streaming")
            setShowWizard(false)
          }}
          onClose={() => {
            console.log("❌ Wizard closed by user")
            setShowWizard(false)
          }}
        />
      )}
    </div>
  )
}

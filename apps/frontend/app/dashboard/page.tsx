"use client";
import React, { useMemo, useState } from "react";
import { Globe, Plus, ChevronDown, ChevronUp, Moon, Sun, RefreshCw } from "lucide-react";
import { useWebsites } from "@/hooks/useWebsites";
import { Button } from "@/components/ui/button";

// Uptime status types
type UptimeStatus = "good" | "bad" | "unknown";

function StatusDot({ status }: { status: UptimeStatus }) {
  const color =
    status === "good"
      ? "bg-green-500"
      : status === "bad"
      ? "bg-red-500"
      : "bg-gray-400";
  return <span className={`inline-block w-3 h-3 rounded-full ${color} mr-2`} />;
}

function UptimeTicks({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex gap-1 items-center">
      {ticks.map((status, idx) => (
        <span
          key={idx}
          className={`
            w-2.5 h-2.5 rounded-full border
            ${status === "good" ? "bg-green-400 border-green-600" : ""}
            ${status === "bad" ? "bg-red-400 border-red-600" : ""}
            ${status === "unknown" ? "bg-gray-300 border-gray-400" : ""}
          `}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { websites, refreshWebsites } = useWebsites();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-[#18181c] dark:to-[#111113] py-12 px-2 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              Website Uptime Monitor
            </h1>
            <div className="text-gray-500 my-1 dark:text-gray-400">
              Real-time health & status of your monitored websites.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={refreshWebsites}>
              <RefreshCw className="mr-2 animate-spin-slow" />
              Refresh
            </Button>
            <Button variant="default" size="sm">
              <Plus className="mr-1" />
              Add Website
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-white/80 dark:bg-black/50 shadow-lg divide-y border border-gray-200 dark:border-gray-800">
          {(!websites || websites.length === 0) && (
            <div className="p-8 text-center text-gray-600 dark:text-gray-300">
              <span className="text-lg">No websites added yet.</span>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  <Plus className="mr-1" />
                  Add your first website
                </Button>
              </div>
            </div>
          )}

          {websites &&
            websites.map((website: any) => {
              // Compute status of last tick
              const lastTick = website.ticks?.[0];
              let status: UptimeStatus = "unknown";
              if (lastTick?.status === "good") status = "good";
              else if (lastTick?.status === "bad") status = "bad";

              // Get last 30 ticks, default to unknown if not enough
              const ticks: UptimeStatus[] = Array(30)
                .fill("unknown")
                .map((_, i) => website.ticks?.[i]?.status || "unknown");

              return (
                <div key={website.id} className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                  <button
                    className="w-full px-6 py-5 text-left focus:outline-none flex items-center justify-between"
                    onClick={() =>
                      setExpanded(expanded === website.id ? null : website.id)
                    }
                  >
                    <div className="flex items-center gap-3 w-56">
                      <StatusDot status={status} />
                      <span className="font-medium truncate">{website.url}</span>
                    </div>
                    <div className="flex-1">
                      <UptimeTicks ticks={ticks} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>
                        Last checked:{" "}
                        {lastTick
                          ? new Date(lastTick.createdAt).toLocaleTimeString()
                          : "-"}
                      </span>
                      {expanded === website.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>
                  {expanded === website.id && (
                    <div className="pb-5 px-6">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Latest status:</div>
                          <div className="flex items-center gap-2">
                            <StatusDot status={status} />
                            {status === "good" && <span className="text-green-600 font-medium">Online</span>}
                            {status === "bad" && <span className="text-red-600 font-medium">Down</span>}
                            {status === "unknown" && <span className="text-gray-500">Unknown</span>}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Last Response Time:</div>
                          <span>
                            {lastTick?.latency
                              ? `${lastTick.latency} ms`
                              : "--"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-5">
                        <span className="text-sm text-gray-400">Last {website.ticks?.length || 0} checks shown.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

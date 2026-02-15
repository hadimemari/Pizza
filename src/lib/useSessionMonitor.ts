"use client";

import { useEffect, useRef, useCallback } from "react";

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes - ping server to refresh session
const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

/**
 * Client-side session inactivity monitor.
 * - Tracks user activity (mouse, keyboard, touch, scroll)
 * - After 30 min idle → auto-logout
 * - Every 5 min of activity → heartbeat to /api/auth/me to refresh server session
 * - Cross-tab: uses localStorage event to sync logout across tabs
 */
export function useSessionMonitor(
  isLoggedIn: boolean,
  onSessionExpired: () => void
) {
  const lastActivityRef = useRef(Date.now());
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = useCallback(() => {
    // Notify other tabs
    try {
      localStorage.setItem("session_logout", Date.now().toString());
    } catch {}
    onSessionExpired();
  }, [onSessionExpired]);

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      handleLogout();
    }, IDLE_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Track user activity
    const onActivity = () => resetIdleTimer();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    // Start idle timer
    resetIdleTimer();

    // Heartbeat: ping server every 5 min to keep session alive
    heartbeatTimerRef.current = setInterval(async () => {
      const idle = Date.now() - lastActivityRef.current;
      if (idle < IDLE_TIMEOUT) {
        // User was active recently, refresh server session
        try {
          const res = await fetch("/api/auth/me");
          if (res.status === 401) {
            handleLogout();
          }
        } catch {}
      }
    }, HEARTBEAT_INTERVAL);

    // Cross-tab logout sync
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "session_logout") {
        onSessionExpired();
      }
    };
    window.addEventListener("storage", onStorageChange);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [isLoggedIn, resetIdleTimer, handleLogout, onSessionExpired]);
}

/**
 * API service layer for connecting to the LangGraph backend.
 *
 * Currently returns mock data. Replace the implementations with
 * fetch calls to your deployed LangGraph API endpoints.
 */

import type { ChapterInput, Production, Series, DashboardStats, LogEntry } from "@/types";
import {
  mockSeries,
  mockProductions,
  mockCompletedProductions,
  mockStats,
  mockLogs,
} from "@/data/mockData";

// ─── Base URL (set this to your LangGraph API) ─────────────────────
const API_BASE = import.meta.env.VITE_LANGGRAPH_API_URL ?? "http://localhost:8000";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _base = API_BASE; // reserved for future fetch calls

// ─── Series & Library ───────────────────────────────────────────────

export async function fetchSeries(): Promise<Series[]> {
  // TODO: Replace with fetch(`${API_BASE}/series`)
  return mockSeries;
}

export async function fetchSeriesById(id: string): Promise<Series | undefined> {
  return mockSeries.find((s) => s.id === id);
}

// ─── Productions ────────────────────────────────────────────────────

export async function fetchActiveProductions(): Promise<Production[]> {
  return mockProductions;
}

export async function fetchCompletedProductions(): Promise<Production[]> {
  return mockCompletedProductions;
}

export async function fetchProductionById(id: string): Promise<Production | undefined> {
  return [...mockProductions, ...mockCompletedProductions].find((p) => p.id === id);
}

// ─── Chapter Production ─────────────────────────────────────────────

export async function startChapterProduction(input: ChapterInput): Promise<Production> {
  console.log("Starting chapter production with input:", input);
  // TODO: POST to `${API_BASE}/productions`
  return mockProductions[0]; // placeholder
}

// ─── Review Actions ─────────────────────────────────────────────────

export async function approvePhase(productionId: string, phase: string): Promise<void> {
  console.log(`Approving phase "${phase}" for production ${productionId}`);
  // TODO: POST to `${API_BASE}/productions/${productionId}/approve`
}

export async function requestRevision(
  productionId: string,
  phase: string,
  notes: string
): Promise<void> {
  console.log(`Requesting revision for phase "${phase}" on production ${productionId}:`, notes);
  // TODO: POST to `${API_BASE}/productions/${productionId}/revise`
}

// ─── Stats & Logs ───────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return mockStats;
}

export async function fetchProductionLogs(): Promise<LogEntry[]> {
  return mockLogs;
}

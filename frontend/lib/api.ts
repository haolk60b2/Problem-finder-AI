import { demoReport } from "@/lib/mock-data";
import { Report } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000/api";

export async function getHealthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        status: "degraded",
        label: "Backend unreachable"
      };
    }

    return {
      status: "live",
      label: "Backend ready"
    };
  } catch {
    return {
      status: "mock",
      label: "Running with demo report"
    };
  }
}

export async function getDemoReport(): Promise<Report> {
  return demoReport;
}

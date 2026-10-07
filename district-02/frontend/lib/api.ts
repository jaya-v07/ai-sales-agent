import type { Prospect } from "./types";

type ResearchResponse = {
  reply: string;
  plan: string[];
  prospects: Prospect[];
  activity: string[];
};

class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

function apiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured.");
  }
  return `${baseUrl}${path}`;
}

export async function runResearch(message: string, campaignId: string): Promise<ResearchResponse> {
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, campaign_id: campaignId }),
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("The research service could not be reached.");
  }

  if (!response.ok) {
    throw new ApiError("The research service returned an error.", response.status);
  }
  return response.json() as Promise<ResearchResponse>;
}

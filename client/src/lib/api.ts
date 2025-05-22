import { apiRequest, queryClient } from "./queryClient";
import { BetSlipResult } from "@/types";

const API_BASE = "/api";

export async function generateBetslip(brandIdentifier: string, targetOdds: number): Promise<BetSlipResult | null> {
  try {
    const { data: countries } = await queryClient.getQueryData(['countries']) || {};
    const countryData = countries?.find(c => c.brandIdentifier.toLowerCase() === brandIdentifier.toLowerCase());
    
    if (!countryData) {
      throw new Error(`Invalid brand identifier: ${brandIdentifier}`);
    }
    
    const countryCode = countryData.countryIso2Code.toLowerCase();
    
    const response = await apiRequest("POST", `${API_BASE}/${country}/betslip/generate`, {
      targetOdds,
      brandIdentifier: countryData.brandIdentifier
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error generating betslip:", error);
    throw error;
  }
}

export async function generateBookingCode(country: string, selectionIds: string[]): Promise<{ code: string }> {
  try {
    const response = await apiRequest("POST", `${API_BASE}/${country}/booking/generate`, {
      selectionIds
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error generating booking code:", error);
    throw error;
  }
}
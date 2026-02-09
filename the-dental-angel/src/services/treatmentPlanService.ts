/**
 * Treatment Plan Service
 *
 * Persists treatment plans analyzed from uploaded photos.
 * Uses AsyncStorage so plans survive between app sessions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TreatmentItem } from '../components/TreatmentPlanCard';

const STORAGE_KEY = 'dental_angel_treatment_plans';

export interface SavedTreatmentPlan {
  id: string;
  treatments: TreatmentItem[];
  imageUri?: string;
  analysisText: string;
  createdAt: string;
}

/**
 * Save a new treatment plan from image analysis
 */
export async function saveTreatmentPlan(
  treatments: TreatmentItem[],
  analysisText: string,
  imageUri?: string
): Promise<SavedTreatmentPlan> {
  const plan: SavedTreatmentPlan = {
    id: Date.now().toString(),
    treatments,
    imageUri,
    analysisText,
    createdAt: new Date().toISOString(),
  };

  const existing = await getAllTreatmentPlans();
  existing.unshift(plan); // newest first
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return plan;
}

/**
 * Get all saved treatment plans
 */
export async function getAllTreatmentPlans(): Promise<SavedTreatmentPlan[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

/**
 * Get the most recent treatment plan
 */
export async function getLatestTreatmentPlan(): Promise<SavedTreatmentPlan | null> {
  const plans = await getAllTreatmentPlans();
  return plans.length > 0 ? plans[0] : null;
}

/**
 * Delete a treatment plan by ID
 */
export async function deleteTreatmentPlan(planId: string): Promise<void> {
  const plans = await getAllTreatmentPlans();
  const filtered = plans.filter((p) => p.id !== planId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Parse treatment items from AI analysis text.
 *
 * The AI is instructed to include a structured block like:
 *
 * ---TREATMENT_ITEMS---
 * ITEM: D2740 | Crown - Porcelain/Ceramic | Tooth #14 | 1200 | Explanation text | 7
 * ---END_TREATMENT_ITEMS---
 *
 * Falls back to empty array if no structured data found.
 */
export function parseTreatmentItems(analysisText: string): {
  treatments: TreatmentItem[];
  cleanText: string;
} {
  const blockRegex = /---TREATMENT_ITEMS---\s*([\s\S]*?)\s*---END_TREATMENT_ITEMS---/i;
  const match = analysisText.match(blockRegex);

  if (!match) {
    return { treatments: [], cleanText: analysisText };
  }

  const cleanText = analysisText.replace(blockRegex, '').trim();
  const itemLines = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('ITEM:'));

  const treatments: TreatmentItem[] = [];

  for (const line of itemLines) {
    const parts = line
      .replace(/^ITEM:\s*/, '')
      .split('|')
      .map((s) => s.trim());

    if (parts.length >= 4) {
      const cost = parseInt(parts[3], 10);
      const score = parts[5] ? parseInt(parts[5], 10) : 0;
      treatments.push({
        id: `${Date.now()}-${treatments.length}`,
        code: parts[0] || 'N/A',
        name: parts[1] || 'Unknown Procedure',
        tooth: parts[2] || undefined,
        cost: isNaN(cost) ? 0 : cost,
        explanation: parts[4] || undefined,
        score: isNaN(score) ? 0 : score * 10, // Convert 1-10 to percentage-like (10-100)
      });
    }
  }

  return { treatments, cleanText };
}

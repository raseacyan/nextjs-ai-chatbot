import { tool } from "ai";
import { z } from "zod";
import { searchKnowledgeBase } from "@/lib/knowledge";

/**
 * AI Tool: Search Knowledge Base
 * Allows the AI to search through JSON knowledge files
 */
export const searchKnowledgeTool = tool({
  description: "Search through knowledge base JSON files for relevant information. Use this when users ask questions that might be answered by the knowledge base content.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant knowledge base content"),
    maxResults: z.number().describe("Maximum number of results to return (default: 3)").default(3).optional(),
  }),
  execute: async ({ query, maxResults = 3 }: { query: string; maxResults?: number }) => {
    return await searchKnowledgeBase(query, maxResults);
  }
});
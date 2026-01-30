import { searchKnowledgeBase } from "@/lib/knowledge";

/**
 * AI Tool: Search Knowledge Base
 * Allows the AI to search through JSON knowledge files
 */
export const searchKnowledgeTool = {
  description: "Search through knowledge base JSON files for relevant information. Use this when users ask questions that might be answered by the knowledge base content.",
  parameters: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "The search query to find relevant knowledge base content"
      },
      maxResults: {
        type: "number",
        description: "Maximum number of results to return (default: 3)",
        default: 3
      }
    },
    required: ["query"]
  },
  execute: async ({ query, maxResults = 3 }: { query: string; maxResults?: number }) => {
    return await searchKnowledgeBase(query, maxResults);
  }
};
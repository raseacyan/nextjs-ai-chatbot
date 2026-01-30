/**
 * Knowledge base utilities for loading and managing JSON knowledge files
 */

export interface KnowledgeTopic {
  title: string;
  content: string;
  tags: string[];
}

export interface KnowledgeCategory {
  name: string;
  description: string;
  topics: KnowledgeTopic[];
}

export interface KnowledgeData {
  categories: KnowledgeCategory[];
  metadata: {
    version: string;
    lastUpdated: string;
    author: string;
  };
}

/**
 * Load knowledge data from a JSON file in the public/knowledge directory
 */
export async function loadKnowledgeFile(filename: string): Promise<KnowledgeData | null> {
  try {
    const response = await fetch(`/knowledge/${filename}`);
    if (!response.ok) {
      console.warn(`Knowledge file ${filename} not found`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading knowledge file ${filename}:`, error);
    return null;
  }
}

/**
 * Load and merge multiple knowledge files into a single knowledge base
 */
export async function loadMultipleKnowledgeFiles(filenames: string[]): Promise<KnowledgeData | null> {
  try {
    // Load all files in parallel
    const promises = filenames.map(filename => loadKnowledgeFile(filename));
    const results = await Promise.all(promises);

    // Filter out null results (failed loads)
    const validResults = results.filter((result): result is KnowledgeData => result !== null);

    if (validResults.length === 0) {
      console.warn('No valid knowledge files found');
      return null;
    }

    // Merge all knowledge data
    const mergedKnowledge: KnowledgeData = {
      categories: [],
      metadata: {
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        author: 'Knowledge Base System'
      }
    };

    // Create a map to track categories and avoid duplicates
    const categoryMap = new Map<string, KnowledgeCategory>();

    validResults.forEach(knowledge => {
      // Update metadata (take the latest version and combine authors)
      if (knowledge.metadata.version > mergedKnowledge.metadata.version) {
        mergedKnowledge.metadata.version = knowledge.metadata.version;
      }
      if (new Date(knowledge.metadata.lastUpdated) > new Date(mergedKnowledge.metadata.lastUpdated)) {
        mergedKnowledge.metadata.lastUpdated = knowledge.metadata.lastUpdated;
      }
      if (mergedKnowledge.metadata.author === 'Knowledge Base System') {
        mergedKnowledge.metadata.author = knowledge.metadata.author;
      } else if (!mergedKnowledge.metadata.author.includes(knowledge.metadata.author)) {
        mergedKnowledge.metadata.author += `, ${knowledge.metadata.author}`;
      }

      // Merge categories
      knowledge.categories.forEach(category => {
        const existingCategory = categoryMap.get(category.name.toLowerCase());

        if (existingCategory) {
          // Merge topics into existing category
          const existingTopicTitles = new Set(
            existingCategory.topics.map(topic => topic.title.toLowerCase())
          );

          // Add new topics that don't already exist
          category.topics.forEach(topic => {
            if (!existingTopicTitles.has(topic.title.toLowerCase())) {
              existingCategory.topics.push(topic);
            }
          });
        } else {
          // Add new category
          categoryMap.set(category.name.toLowerCase(), { ...category });
        }
      });
    });

    // Convert map back to array
    mergedKnowledge.categories = Array.from(categoryMap.values());

    return mergedKnowledge;
  } catch (error) {
    console.error('Error loading multiple knowledge files:', error);
    return null;
  }
}

/**
 * Load all JSON files from the knowledge directory
 * Note: This requires an API endpoint to list files, or you can hardcode the filenames
 */
export async function loadAllKnowledgeFiles(): Promise<KnowledgeData | null> {
  // Update this list with your actual knowledge file names
  const filenames = [
    'g05_history.json',
    
    // Add your new file names here
  ];

  return loadMultipleKnowledgeFiles(filenames);
}

/**
 * Search knowledge base for topics matching a query
 */
export function searchKnowledge(
  knowledge: KnowledgeData,
  query: string,
  maxResults: number = 5
): KnowledgeTopic[] {
  const results: Array<{ topic: KnowledgeTopic; score: number }> = [];

  knowledge.categories.forEach(category => {
    category.topics.forEach(topic => {
      let score = 0;

      // Title match (highest weight)
      if (topic.title.toLowerCase().includes(query.toLowerCase())) {
        score += 10;
      }

      // Content match
      if (topic.content.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
      }

      // Tag match
      if (topic.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
        score += 3;
      }

      if (score > 0) {
        results.push({ topic, score });
      }
    });
  });

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(result => result.topic);
}

/**
 * Get all topics from knowledge base
 */
export function getAllTopics(knowledge: KnowledgeData): KnowledgeTopic[] {
  return knowledge.categories.flatMap(category => category.topics);
}

/**
 * Get topics by category
 */
export function getTopicsByCategory(
  knowledge: KnowledgeData,
  categoryName: string
): KnowledgeTopic[] {
  const category = knowledge.categories.find(cat =>
    cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  return category ? category.topics : [];
}
# Knowledge Base System

This project includes a knowledge base system that allows you to add JSON files containing helpful information that can be used by your AI assistant and displayed in your application.

## File Structure

```
public/
  knowledge/
    help.json          # Basic help and getting started
    faq.json           # Frequently asked questions
    guides.json        # User guides and tutorials
    features.json      # Feature documentation

lib/
  knowledge.ts        # Utility functions for loading and searching knowledge

components/
  knowledge-example.tsx  # Example component showing how to use knowledge
```

## Loading Multiple Files

Instead of loading one file at a time, you can load multiple knowledge files and merge them:

### **Option 1: Load Specific Files**
```typescript
import { loadMultipleKnowledgeFiles } from '@/lib/knowledge';

// Load specific files
const knowledge = await loadMultipleKnowledgeFiles([
  'help.json',
  'faq.json',
  'guides.json'
]);
```

### **Option 2: Load All Files (Auto-detect)**
```typescript
import { loadAllKnowledgeFiles } from '@/lib/knowledge';

// Load all available files (customize the list in the function)
const knowledge = await loadAllKnowledgeFiles();
```

### **Option 3: Load Single File (Original Method)**
```typescript
import { loadKnowledgeFile } from '@/lib/knowledge';

// Load one specific file
const knowledge = await loadKnowledgeFile('help.json');
```

## How Merging Works

When loading multiple files, the system:

1. **Combines categories** with the same name (case-insensitive)
2. **Merges topics** within categories, avoiding duplicates by title
3. **Updates metadata** to reflect the latest version and combined authors
4. **Preserves all unique content** from all files

## Adding Knowledge Files

1. **Create JSON files** in `public/knowledge/` with this structure:

```json
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Brief description of this category",
      "topics": [
        {
          "title": "Topic Title",
          "content": "Detailed information about this topic",
          "tags": ["tag1", "tag2", "tag3"]
        }
      ]
    }
  ],
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2024-01-30",
    "author": "Your Team"
  }
}
```

2. **Use in Components**:

```typescript
import { loadMultipleKnowledgeFiles, searchKnowledge } from '@/lib/knowledge';

// Load and search across multiple files
const knowledge = await loadMultipleKnowledgeFiles(['help.json', 'faq.json']);
const results = searchKnowledge(knowledge, 'search query');
```

3. **AI Integration**: The AI system prompt references knowledge base information when answering user questions.

## Available Functions

- `loadKnowledgeFile(filename)` - Load a single JSON knowledge file
- `loadMultipleKnowledgeFiles(filenames[])` - Load and merge multiple files
- `loadAllKnowledgeFiles()` - Load all available files (configurable list)
- `searchKnowledge(knowledge, query, maxResults)` - Search for relevant topics
- `getAllTopics(knowledge)` - Get all topics from knowledge base
- `getTopicsByCategory(knowledge, categoryName)` - Get topics from specific category

## Example Usage

See `components/knowledge-example.tsx` for a complete example showing all loading methods and search functionality.
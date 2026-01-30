'use client';

import { useEffect, useState } from 'react';
import {
  loadKnowledgeFile,
  loadMultipleKnowledgeFiles,
  loadAllKnowledgeFiles,
  searchKnowledge,
  type KnowledgeData,
  type KnowledgeTopic
} from '@/lib/knowledge';

export function KnowledgeExample() {
  const [knowledge, setKnowledge] = useState<KnowledgeData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadMethod, setLoadMethod] = useState<'single' | 'multiple' | 'all'>('single');

  useEffect(() => {
    loadKnowledge();
  }, [loadMethod]);

  const loadKnowledge = async () => {
    setLoading(true);
    let data: KnowledgeData | null = null;

    try {
      switch (loadMethod) {
        case 'single':
          data = await loadKnowledgeFile('help.json');
          break;
        case 'multiple':
          // Load specific files
          data = await loadMultipleKnowledgeFiles(['help.json', 'faq.json']);
          break;
        case 'all':
          // Load all available files (you can customize the list in the function)
          data = await loadAllKnowledgeFiles();
          break;
      }
    } catch (error) {
      console.error('Error loading knowledge:', error);
    }

    setKnowledge(data);
    setLoading(false);
  };

  const handleSearch = () => {
    if (knowledge && searchQuery.trim()) {
      const results = searchKnowledge(knowledge, searchQuery);
      setSearchResults(results);
    }
  };

  if (loading) {
    return <div>Loading knowledge base...</div>;
  }

  if (!knowledge) {
    return <div>Failed to load knowledge base</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Knowledge Base Example</h2>

      {/* Load Method Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Load Method:</label>
        <select
          value={loadMethod}
          onChange={(e) => setLoadMethod(e.target.value as 'single' | 'multiple' | 'all')}
          className="border p-2 mr-2"
        >
          <option value="single">Single File (help.json)</option>
          <option value="multiple">Multiple Files (help.json + faq.json)</option>
          <option value="all">All Files (auto-detect)</option>
        </select>
        <button
          onClick={loadKnowledge}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Reload
        </button>
      </div>

      {/* Search Interface */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="border p-2 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
          {searchResults.map((topic, index) => (
            <div key={index} className="border p-3 mb-2 rounded">
              <h4 className="font-medium">{topic.title}</h4>
              <p className="text-sm text-gray-600">{topic.content}</p>
              <div className="flex gap-1 mt-1">
                {topic.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Knowledge Base Stats:</h3>
        <p><strong>Categories:</strong> {knowledge.categories.length}</p>
        <p><strong>Total Topics:</strong> {knowledge.categories.reduce((sum, cat) => sum + cat.topics.length, 0)}</p>
        <p><strong>Version:</strong> {knowledge.metadata.version}</p>
        <p><strong>Last Updated:</strong> {knowledge.metadata.lastUpdated}</p>
        <p><strong>Author:</strong> {knowledge.metadata.author}</p>
      </div>

      {/* All Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-2">All Categories:</h3>
        {knowledge.categories.map((category, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <h4 className="font-medium">{category.name}</h4>
            <p className="text-sm text-gray-600">{category.description}</p>
            <p className="text-xs text-gray-500">{category.topics.length} topics</p>
          </div>
        ))}
      </div>
    </div>
  );
}
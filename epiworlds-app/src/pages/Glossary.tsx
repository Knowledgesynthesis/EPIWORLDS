import { useState, useMemo } from 'react';
import { glossaryTerms } from '../data/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search } from 'lucide-react';

export function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(glossaryTerms.map((term) => term.category)));
    return ['All', ...cats.sort()];
  }, []);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.synonyms?.some((syn) =>
          syn.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Epidemiology Glossary</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive definitions of key terms in clinical epidemiology and
          causal inference.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search terms, definitions, or synonyms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTerms.length} of {glossaryTerms.length} terms
      </div>

      {/* Glossary Terms */}
      <div className="space-y-4">
        {filteredTerms.map((term) => (
          <Card key={term.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{term.term}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{term.category}</Badge>
                    {term.synonyms && term.synonyms.length > 0 && (
                      <Badge variant="outline">
                        Also: {term.synonyms.join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base">{term.definition}</p>

              {term.examples && term.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {term.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Related Terms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTerms.map((related, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setSearchTerm(related)}
                      >
                        {related}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredTerms.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No terms found matching your search criteria.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { biasTypes } from '../data/biasTypes';
import type { BiasDefinition } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AlertCircle, Shield, TrendingUp, TrendingDown, Shuffle } from 'lucide-react';

export function BiasLab() {
  const [selectedBias, setSelectedBias] = useState<BiasDefinition | null>(
    biasTypes[0]
  );

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'towards-null':
        return <TrendingDown className="h-4 w-4" />;
      case 'away-from-null':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Shuffle className="h-4 w-4" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'towards-null':
        return 'text-blue-500';
      case 'away-from-null':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bias Visualization Lab</h1>
        <p className="text-muted-foreground mt-2">
          Explore different types of bias and understand how they affect study
          results.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bias Type List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Bias Types</CardTitle>
              <CardDescription>Select a bias to explore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {biasTypes.map((bias) => (
                  <Button
                    key={bias.id}
                    variant={selectedBias?.id === bias.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedBias(bias)}
                  >
                    {bias.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bias Details */}
        {selectedBias && (
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-2xl">
                      {selectedBias.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {selectedBias.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getDirectionColor(selectedBias.direction)}
                      >
                        <span className="flex items-center gap-1">
                          {getDirectionIcon(selectedBias.direction)}
                          {selectedBias.direction.replace('-', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardDescription className="text-base mt-4">
                  {selectedBias.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Direction Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getDirectionIcon(selectedBias.direction)}
                  Bias Direction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedBias.direction === 'towards-null' && (
                    <p>
                      This bias typically pushes effect estimates{' '}
                      <strong>towards the null</strong> (making associations
                      appear weaker than they truly are). This can lead to false
                      negative findings.
                    </p>
                  )}
                  {selectedBias.direction === 'away-from-null' && (
                    <p>
                      This bias typically pushes effect estimates{' '}
                      <strong>away from the null</strong> (making associations
                      appear stronger than they truly are). This can lead to false
                      positive findings.
                    </p>
                  )}
                  {selectedBias.direction === 'unpredictable' && (
                    <p>
                      The direction of this bias is <strong>unpredictable</strong>{' '}
                      and depends on the specific study context. It can push
                      estimates towards or away from the null, making it
                      particularly challenging to identify and correct.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Real-World Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedBias.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prevention Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Prevention Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedBias.prevention.map((strategy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Interactive Simulation Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Simulation (Coming Soon)</CardTitle>
          <CardDescription>
            Visualize how {selectedBias?.name.toLowerCase()} affects study results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 border rounded-md bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">
              Interactive visualization will be displayed here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

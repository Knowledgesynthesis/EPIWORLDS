import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RefreshCw, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  generateSyntheticDataset,
  calculateRiskRatio,
  calculateStratifiedRiskRatio,
  calculateMantelHaenszel,
} from '../lib/dataGenerator';

const scenarios = [
  {
    id: 'confounding',
    name: 'Example: Confounding by Age',
    description:
      'Age is associated with both smoking and heart disease. Adjusting for age removes confounding.',
    params: {
      sampleSize: 1000,
      exposurePrevalence: 0.3,
      outcomeBaselineRisk: 0.1,
      relativeRisk: 2.0,
      confounders: [
        {
          name: 'Age_Over_50',
          prevalence: 0.5,
          exposureEffect: 1.8,
          outcomeEffect: 2.5,
        },
      ],
    },
    stratifyBy: 'Age_Over_50',
    expectedPattern: 'confounding',
  },
  {
    id: 'effect-modification',
    name: 'Example: Effect Modification by Sex',
    description:
      'Treatment effect differs between males and females. Stratified estimates should be reported separately.',
    params: {
      sampleSize: 1000,
      exposurePrevalence: 0.5,
      outcomeBaselineRisk: 0.15,
      relativeRisk: 1.2,
      confounders: [
        {
          name: 'Male',
          prevalence: 0.5,
          exposureEffect: 1.0,
          outcomeEffect: 0.5,
        },
      ],
    },
    stratifyBy: 'Male',
    expectedPattern: 'effect-modification',
  },
];

export function ConfoundingLab() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [seed, setSeed] = useState(12345);

  const dataset = useMemo(
    () => generateSyntheticDataset({ ...selectedScenario.params, seed }),
    [selectedScenario, seed]
  );

  const crudeResults = useMemo(() => calculateRiskRatio(dataset.data), [dataset]);

  const stratifiedResults = useMemo(
    () => calculateStratifiedRiskRatio(dataset.data, selectedScenario.stratifyBy),
    [dataset, selectedScenario]
  );

  const mantelHaenszel = useMemo(
    () => calculateMantelHaenszel(dataset.data, selectedScenario.stratifyBy),
    [dataset, selectedScenario]
  );

  const isConfounding =
    Math.abs(crudeResults.riskRatio - mantelHaenszel.adjustedRR) > 0.15;

  const handleRefresh = () => {
    setSeed((s) => s + 1);
  };

  // Prepare chart data
  const chartData = [
    {
      name: 'Crude',
      riskRatio: crudeResults.riskRatio,
    },
    ...Object.entries(stratifiedResults).map(([stratum, results]) => ({
      name: `Stratum ${stratum}`,
      riskRatio: results.riskRatio,
    })),
    {
      name: 'M-H Adjusted',
      riskRatio: mantelHaenszel.adjustedRR,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Confounding & Effect Modification Lab</h1>
        <p className="text-muted-foreground mt-2">
          Interactive exploration of confounding and effect modification through
          stratification and Mantel-Haenszel analysis.
        </p>
      </div>

      {/* Scenario Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select a Scenario</CardTitle>
          <CardDescription>
            Choose an example to explore confounding or effect modification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className={`text-left p-4 border rounded-md transition-colors ${
                  selectedScenario.id === scenario.id
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-primary hover:bg-accent'
                }`}
              >
                <h3 className="font-semibold mb-1">{scenario.name}</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </button>
            ))}
          </div>
          <Button onClick={handleRefresh} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Dataset
          </Button>
        </CardContent>
      </Card>

      {/* Crude Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Crude (Unadjusted) Analysis</CardTitle>
          <CardDescription>Risk ratio without stratification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {crudeResults.riskRatio.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Crude Risk Ratio</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {(crudeResults.riskExposed * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Risk in Exposed (n={crudeResults.exposedCount})
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {(crudeResults.riskUnexposed * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Risk in Unexposed (n={crudeResults.unexposedCount})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stratified Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Stratified Analysis</CardTitle>
          <CardDescription>
            Risk ratios within strata of {selectedScenario.stratifyBy}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stratifiedResults).map(([stratum, results]) => (
              <div key={stratum} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">
                    {selectedScenario.stratifyBy} = {stratum}
                  </h4>
                  <Badge variant="outline">
                    RR = {results.riskRatio.toFixed(2)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Risk in Exposed:</span>
                    <span className="ml-2 font-medium">
                      {(results.riskExposed * 100).toFixed(1)}% (n=
                      {results.exposedCount})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk in Unexposed:</span>
                    <span className="ml-2 font-medium">
                      {(results.riskUnexposed * 100).toFixed(1)}% (n=
                      {results.unexposedCount})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mantel-Haenszel Adjusted */}
      <Card>
        <CardHeader>
          <CardTitle>Mantel-Haenszel Adjusted Risk Ratio</CardTitle>
          <CardDescription>
            Pooled estimate adjusted for {selectedScenario.stratifyBy}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 border rounded-md">
              <div className="text-4xl font-bold text-primary">
                {mantelHaenszel.adjustedRR.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                M-H Adjusted RR
              </p>
            </div>
            <div className="text-center p-4 border rounded-md">
              <div className="text-4xl font-bold">
                {mantelHaenszel.crudeRR.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Crude RR</p>
            </div>
          </div>

          {isConfounding && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-500 rounded-md">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Confounding Detected!
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  The crude estimate ({mantelHaenszel.crudeRR.toFixed(2)}) differs
                  substantially from the adjusted estimate (
                  {mantelHaenszel.adjustedRR.toFixed(2)}), indicating confounding by{' '}
                  {selectedScenario.stratifyBy}.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Ratio Comparison</CardTitle>
          <CardDescription>
            Visual comparison of crude, stratified, and adjusted estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 'auto']} label={{ value: 'Risk Ratio', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="riskRatio" fill="hsl(var(--primary))" name="Risk Ratio" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Interpretation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Confounding</h3>
            <p className="text-sm text-muted-foreground">
              Present when: (1) Crude and adjusted estimates differ substantially, AND
              (2) Stratified estimates are similar to each other. The adjusted estimate
              is the true causal effect.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Effect Modification</h3>
            <p className="text-sm text-muted-foreground">
              Present when: (1) Stratified estimates differ meaningfully from each
              other. Report stratified estimates separately rather than pooling.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

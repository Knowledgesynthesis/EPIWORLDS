import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PlayCircle, Info } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  
  
} from 'recharts';
import { generateSyntheticDataset, calculateRiskRatio } from '../lib/dataGenerator';

export function StudySandbox() {
  const [sampleSize, setSampleSize] = useState(500);
  const [exposurePrevalence, setExposurePrevalence] = useState(0.3);
  const [outcomeBaselineRisk, setOutcomeBaselineRisk] = useState(0.1);
  const [trueRR, setTrueRR] = useState(2.0);
  const [selectionBiasMagnitude, setSelectionBiasMagnitude] = useState(0);
  const [measurementError, setMeasurementError] = useState(0);
  const [seed, setSeed] = useState(12345);

  // Generate dataset with current parameters
  const dataset = useMemo(() => {
    return generateSyntheticDataset({
      sampleSize,
      exposurePrevalence: exposurePrevalence * (1 + selectionBiasMagnitude),
      outcomeBaselineRisk,
      relativeRisk: trueRR,
      seed,
    });
  }, [sampleSize, exposurePrevalence, outcomeBaselineRisk, trueRR, selectionBiasMagnitude, seed]);

  // Calculate observed RR (with bias)
  const observedResults = useMemo(() => {
    // Apply measurement error by randomly misclassifying some exposures
    const biasedData = dataset.data.map((row) => {
      if (measurementError > 0 && Math.random() < measurementError) {
        return { ...row, exposure: 1 - row.exposure };
      }
      return row;
    });
    return calculateRiskRatio(biasedData);
  }, [dataset, measurementError]);

  // Calculate confidence interval (simplified)
  const calculateCI = (rr: number, n: number) => {
    const se = Math.sqrt(1 / (n * 0.25)); // Simplified SE
    const lowerCI = Math.max(0, rr - 1.96 * se);
    const upperCI = rr + 1.96 * se;
    return { lowerCI, upperCI };
  };

  const ci = calculateCI(observedResults.riskRatio, sampleSize);

  // Simulate power analysis
  const powerData = useMemo(() => {
    const sizes = [100, 200, 500, 1000, 2000, 5000];
    return sizes.map((n) => {
      const power = 1 - Math.exp(-0.0005 * n * Math.abs(trueRR - 1));
      return {
        sampleSize: n,
        power: Math.min(0.95, power),
      };
    });
  }, [trueRR]);

  const handleRunSimulation = () => {
    setSeed((s) => s + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study Design Sandbox</h1>
        <p className="text-muted-foreground mt-2">
          Design your own study and see how different parameters affect results
          and validity.
        </p>
      </div>

      {/* Study Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Study Parameters</CardTitle>
          <CardDescription>
            Adjust parameters to design your study
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sample Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Sample Size</span>
              <Badge variant="outline">{sampleSize}</Badge>
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Larger samples provide more precise estimates
            </p>
          </div>

          {/* Exposure Prevalence */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Exposure Prevalence</span>
              <Badge variant="outline">{(exposurePrevalence * 100).toFixed(0)}%</Badge>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={exposurePrevalence}
              onChange={(e) => setExposurePrevalence(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* True Relative Risk */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>True Relative Risk</span>
              <Badge variant="outline">{trueRR.toFixed(2)}</Badge>
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={trueRR}
              onChange={(e) => setTrueRR(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              RR=1 means no association; RR&gt;1 increases risk; RR&lt;1 decreases risk
            </p>
          </div>

          {/* Baseline Outcome Risk */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Baseline Outcome Risk (Unexposed)</span>
              <Badge variant="outline">{(outcomeBaselineRisk * 100).toFixed(0)}%</Badge>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={outcomeBaselineRisk}
              onChange={(e) => setOutcomeBaselineRisk(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4">Introduce Bias</h4>

            {/* Selection Bias */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Selection Bias</span>
                <Badge variant={selectionBiasMagnitude > 0 ? 'destructive' : 'outline'}>
                  {selectionBiasMagnitude > 0 ? 'Present' : 'None'}
                </Badge>
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={selectionBiasMagnitude}
                onChange={(e) => setSelectionBiasMagnitude(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Differential selection of exposed vs unexposed
              </p>
            </div>

            {/* Measurement Error */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                <span>Measurement Error</span>
                <Badge variant={measurementError > 0 ? 'destructive' : 'outline'}>
                  {(measurementError * 100).toFixed(0)}% misclassified
                </Badge>
              </label>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.05"
                value={measurementError}
                onChange={(e) => setMeasurementError(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Random misclassification of exposure (biases toward null)
              </p>
            </div>
          </div>

          <Button onClick={handleRunSimulation} className="w-full">
            <PlayCircle className="mr-2 h-4 w-4" />
            Run Simulation
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Results</CardTitle>
            <CardDescription>Observed outcomes from your study design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">
                {observedResults.riskRatio.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Observed Risk Ratio</p>
              <p className="text-xs text-muted-foreground mt-1">
                95% CI: [{ci.lowerCI.toFixed(2)}, {ci.upperCI.toFixed(2)}]
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
              <div>
                <div className="text-2xl font-bold">
                  {(observedResults.riskExposed * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Risk in Exposed</p>
                <p className="text-xs text-muted-foreground">
                  (n={observedResults.exposedCount})
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(observedResults.riskUnexposed * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Risk in Unexposed</p>
                <p className="text-xs text-muted-foreground">
                  (n={observedResults.unexposedCount})
                </p>
              </div>
            </div>

            {/* Bias Alert */}
            {Math.abs(observedResults.riskRatio - trueRR) > 0.2 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-500 rounded-md">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                    Bias Detected!
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Observed RR ({observedResults.riskRatio.toFixed(2)}) differs from
                    true RR ({trueRR.toFixed(2)}) due to bias
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
            <CardDescription>True vs observed estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm font-medium">True RR</span>
                <Badge variant="default">{trueRR.toFixed(2)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm font-medium">Observed RR</span>
                <Badge
                  variant={
                    Math.abs(observedResults.riskRatio - trueRR) > 0.2
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {observedResults.riskRatio.toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm font-medium">Bias Magnitude</span>
                <Badge variant="outline">
                  {((observedResults.riskRatio - trueRR) / trueRR * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Power vs Sample Size</CardTitle>
          <CardDescription>
            How sample size affects ability to detect the true effect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={powerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sampleSize" label={{ value: 'Sample Size', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[0, 1]} label={{ value: 'Statistical Power', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="power"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Power"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your current sample size ({sampleSize}) provides approximately{' '}
            {(powerData.find(d => d.sampleSize >= sampleSize)?.power ?? 0 * 100).toFixed(0)}% power
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import type { BiasDefinition } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface BiasSimulationProps {
  bias: BiasDefinition;
}

export function BiasSimulation({ bias }: BiasSimulationProps) {
  const [biasMagnitude, setBiasMagnitude] = useState(0.3);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when bias magnitude changes
  const handleBiasChange = (value: number) => {
    setBiasMagnitude(value);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Generate simulation data based on bias type
  const simulationData = useMemo(() => {
    const trueRR = 2.5; // True risk ratio
    const baselineRisk = 0.1;
    const sampleSize = 1000;

    let biasedRR: number;
    let explanation: string;
    let chartType: 'bar' | 'scatter' = 'bar';

    switch (bias.type) {
      case 'selection':
        // Selection bias often pushes towards null
        biasedRR = trueRR - (trueRR - 1) * biasMagnitude;
        explanation = `Selection bias is reducing the observed association. ${Math.round(biasMagnitude * 100)}% of the exposed cases are being excluded from the study.`;
        chartType = 'bar';
        break;

      case 'information':
        // Information bias can go either direction
        if (bias.direction === 'towards-null') {
          biasedRR = trueRR - (trueRR - 1) * biasMagnitude;
        } else {
          biasedRR = trueRR + (trueRR * biasMagnitude);
        }
        explanation = `Misclassification error rate: ${Math.round(biasMagnitude * 100)}%. This is ${bias.direction === 'towards-null' ? 'reducing' : 'inflating'} the observed effect.`;
        break;

      case 'recall':
        // Recall bias typically away from null
        biasedRR = trueRR + (trueRR * biasMagnitude * 1.5);
        explanation = `Cases recall exposure ${Math.round(biasMagnitude * 100)}% more accurately than controls, inflating the association.`;
        break;

      case 'confounding':
        // Confounding can go either direction
        biasedRR = trueRR + (trueRR * biasMagnitude * (Math.random() > 0.5 ? 1 : -0.8));
        explanation = `Confounding variable strength: ${Math.round(biasMagnitude * 100)}%. The confounder is distorting the true causal effect.`;
        break;

      case 'publication':
        // Publication bias - show funnel plot asymmetry
        chartType = 'scatter';
        biasedRR = trueRR + (biasMagnitude * 0.8);
        explanation = `Publication bias is favoring significant positive results. ${Math.round(biasMagnitude * 100)}% of null/negative studies are unpublished.`;
        break;

      default:
        biasedRR = trueRR - (trueRR - 1) * biasMagnitude * 0.5;
        explanation = `Bias magnitude: ${Math.round(biasMagnitude * 100)}%`;
    }

    // Generate comparison data
    const comparisonData = [
      {
        scenario: 'True Effect',
        riskRatio: Number(trueRR.toFixed(2)),
        exposed: Number((baselineRisk * trueRR * sampleSize / 2).toFixed(0)),
        unexposed: Number((baselineRisk * sampleSize / 2).toFixed(0)),
        type: 'true',
      },
      {
        scenario: 'Observed (Biased)',
        riskRatio: Number(biasedRR.toFixed(2)),
        exposed: Number((baselineRisk * biasedRR * sampleSize / 2).toFixed(0)),
        unexposed: Number((baselineRisk * sampleSize / 2).toFixed(0)),
        type: 'biased',
      },
    ];

    // For publication bias, generate scatter plot data
    const scatterData: Array<{ x: number; y: number; published: boolean }> = [];
    if (chartType === 'scatter') {
      for (let i = 0; i < 30; i++) {
        const effectSize = trueRR + (Math.random() - 0.5) * 2;
        const sampleSizeVar = 50 + Math.random() * 950;
        const standardError = 1 / Math.sqrt(sampleSizeVar);

        // Publication bias: less likely to publish if non-significant or negative
        const isPubBiased = effectSize < 1.5 && Math.random() < biasMagnitude;
        const published = !isPubBiased;

        scatterData.push({
          x: effectSize,
          y: standardError,
          published,
        });
      }
    }

    return {
      comparisonData,
      scatterData,
      chartType,
      explanation,
      trueRR,
      biasedRR,
      biasPercentage: Math.abs(((biasedRR - trueRR) / trueRR) * 100),
    };
  }, [bias, biasMagnitude]);

  const getBiasWarningLevel = (biasPercentage: number) => {
    if (biasPercentage < 10) return { color: 'text-yellow-500', level: 'Low', icon: AlertTriangle };
    if (biasPercentage < 30) return { color: 'text-orange-500', level: 'Moderate', icon: AlertTriangle };
    return { color: 'text-red-500', level: 'Severe', icon: AlertTriangle };
  };

  const warning = getBiasWarningLevel(simulationData.biasPercentage);
  const WarningIcon = warning.icon;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Bias Magnitude</label>
              <span className="text-sm font-mono">
                {Math.round(biasMagnitude * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={biasMagnitude}
              onChange={(e) => handleBiasChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Adjust to see how {bias.name.toLowerCase()} affects study results
            </p>
          </div>

          {/* Bias Impact Alert */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 p-3 rounded-md bg-muted border-l-4 ${warning.color.replace('text-', 'border-')}`}
          >
            <WarningIcon className={`h-5 w-5 mt-0.5 ${warning.color}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">
                  {warning.level} Bias Impact
                </span>
                <Badge variant="outline" className={warning.color}>
                  {simulationData.biasPercentage.toFixed(1)}% distortion
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {simulationData.explanation}
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>True Effect vs. Biased Observation</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={biasMagnitude}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {simulationData.chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={simulationData.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="scenario" className="text-sm" />
                  <YAxis label={{ value: 'Risk Ratio', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="riskRatio" name="Risk Ratio" radius={[8, 8, 0, 0]}>
                    {simulationData.comparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'true' ? '#10b981' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Effect Size (RR)"
                    label={{ value: 'Effect Size (Risk Ratio)', position: 'bottom' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Standard Error"
                    label={{ value: 'Standard Error', angle: -90, position: 'insideLeft' }}
                    reversed
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Scatter
                    name="Published Studies"
                    data={simulationData.scatterData.filter(d => d.published)}
                    fill="#10b981"
                  />
                  <Scatter
                    name="Unpublished (File Drawer)"
                    data={simulationData.scatterData.filter(d => !d.published)}
                    fill="#ef4444"
                    opacity={0.4}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Results Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <motion.div
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
              animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">True Effect</span>
              </div>
              <div className="text-2xl font-bold text-green-500">
                RR = {simulationData.trueRR.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Actual causal effect without bias
              </p>
            </motion.div>

            <motion.div
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
              animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                {simulationData.biasedRR > simulationData.trueRR ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">Observed (Biased)</span>
              </div>
              <div className="text-2xl font-bold text-red-500">
                RR = {simulationData.biasedRR.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                What the study would observe with bias
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding This Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            This interactive simulation demonstrates how <strong>{bias.name.toLowerCase()}</strong> can distort
            study findings. The true effect (in green) represents the actual causal relationship, while the
            observed effect (in red) shows what researchers would measure in the presence of bias.
          </p>

          {simulationData.chartType === 'scatter' ? (
            <p>
              The funnel plot shows how publication bias creates asymmetry. Studies with non-significant
              or negative results (shown in red) are less likely to be published, creating a gap in the
              literature and making the overall effect appear stronger than it truly is.
            </p>
          ) : (
            <p>
              As you increase the bias magnitude, notice how the observed effect diverges from the truth.
              This {bias.direction === 'towards-null' ? 'attenuation' : 'inflation'} could lead to
              {bias.direction === 'towards-null' ? ' false negative' : ' false positive'} conclusions.
            </p>
          )}

          <div className="bg-muted p-3 rounded-md">
            <p className="font-medium mb-2">Key Takeaway:</p>
            <p>
              Understanding bias patterns helps researchers design better studies and critically evaluate
              published findings. Prevention strategies (listed above) are essential for minimizing these
              distortions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

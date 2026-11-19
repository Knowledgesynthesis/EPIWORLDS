import { PageHeader } from '../components/PageHeader';
import { PowerCalculator } from '../components/interactives/PowerCalculator';
import { RepeatedSampling } from '../components/interactives/RepeatedSampling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export default function StudySimulator() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Lab" title="Study Simulator">
        Repeat the same study 100 times. Random error scatters the estimates around the truth; bias moves all of them. Then plan the sample size you would need.
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Random error vs systematic error</CardTitle>
          <CardDescription>Each vertical line is one study's 95% CI. Simulations are seeded, so results are reproducible.</CardDescription>
        </CardHeader>
        <CardContent><RepeatedSampling /></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sample size and power for two proportions</CardTitle>
        </CardHeader>
        <CardContent><PowerCalculator /></CardContent>
      </Card>
    </div>
  );
}

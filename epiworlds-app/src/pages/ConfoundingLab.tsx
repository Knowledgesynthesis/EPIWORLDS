import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { FlaskConical } from 'lucide-react';

export function ConfoundingLab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Confounding & Effect Modification Lab</h1>
        <p className="text-muted-foreground mt-2">
          Interactive exploration of confounding and effect modification through
          stratification and data visualization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <FlaskConical className="h-12 w-12 text-primary" />
            <div>
              <CardTitle>Interactive Module Coming Soon</CardTitle>
              <CardDescription>
                This module will include interactive tools for:
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 ml-6">
            <li>• Stratified analysis demonstrations</li>
            <li>• Confounding detection exercises</li>
            <li>• Effect modification visualization</li>
            <li>• Mantel-Haenszel calculations</li>
            <li>• Interactive case studies</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Confounding</h3>
            <p className="text-sm text-muted-foreground">
              A variable that is associated with both the exposure and outcome,
              distorting the true relationship. Must be adjusted for in analysis.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Effect Modification</h3>
            <p className="text-sm text-muted-foreground">
              When the magnitude of an effect differs across levels of a third
              variable. Should be reported through stratification, not adjusted
              away.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

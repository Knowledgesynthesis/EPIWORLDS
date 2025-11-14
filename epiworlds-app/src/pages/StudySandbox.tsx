import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { GraduationCap } from 'lucide-react';

export function StudySandbox() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study Design Sandbox</h1>
        <p className="text-muted-foreground mt-2">
          Design your own studies and see how different design choices affect
          validity, bias, and statistical power.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <GraduationCap className="h-12 w-12 text-primary" />
            <div>
              <CardTitle>Interactive Sandbox Coming Soon</CardTitle>
              <CardDescription>
                This module will allow you to:
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 ml-6">
            <li>• Design custom RCTs and observational studies</li>
            <li>• Manipulate sample size, allocation ratios, and follow-up</li>
            <li>• Introduce various types of bias and see their effects</li>
            <li>• Compare different study designs for the same research question</li>
            <li>• Generate synthetic datasets based on your design</li>
            <li>• Visualize how design choices impact results</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>• Understand trade-offs between different study designs</li>
            <li>• Learn how sample size affects precision</li>
            <li>• See real-time impact of bias on effect estimates</li>
            <li>• Practice making design decisions under constraints</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { studyDesigns } from '../data/studyDesigns';
import type { StudyDesign } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle, Lightbulb, BookOpen } from 'lucide-react';

export function StudyDesigns() {
  const [selectedDesign, setSelectedDesign] = useState<StudyDesign | null>(
    studyDesigns[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study Design Explorer</h1>
        <p className="text-muted-foreground mt-2">
          Compare different epidemiologic study designs and understand their
          strengths and limitations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Study Design List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Study Types</CardTitle>
              <CardDescription>Select a study design to explore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {studyDesigns.map((design) => (
                  <Button
                    key={design.id}
                    variant={
                      selectedDesign?.id === design.id ? 'default' : 'outline'
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedDesign(design)}
                  >
                    {design.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Design Details */}
        {selectedDesign && (
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedDesign.name}
                    </CardTitle>
                    <Badge className="mt-2" variant="secondary">
                      {selectedDesign.type.toUpperCase()}
                    </Badge>
                  </div>
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardDescription className="text-base mt-4">
                  {selectedDesign.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedDesign.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedDesign.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Real-World Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedDesign.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites to Understand This Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedDesign.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Comparison</CardTitle>
          <CardDescription>
            At-a-glance comparison of all study designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Study Design</th>
                  <th className="text-left p-2 font-semibold">Type</th>
                  <th className="text-left p-2 font-semibold">Best For</th>
                  <th className="text-left p-2 font-semibold">Causal Inference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">RCT</td>
                  <td className="p-2">Experimental</td>
                  <td className="p-2">Testing interventions</td>
                  <td className="p-2">
                    <Badge variant="default">Strongest</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Cohort</td>
                  <td className="p-2">Observational</td>
                  <td className="p-2">Rare exposures, incidence</td>
                  <td className="p-2">
                    <Badge variant="secondary">Strong</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Case-Control</td>
                  <td className="p-2">Observational</td>
                  <td className="p-2">Rare outcomes, quick results</td>
                  <td className="p-2">
                    <Badge variant="secondary">Moderate</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Cross-Sectional</td>
                  <td className="p-2">Observational</td>
                  <td className="p-2">Prevalence, hypothesis generation</td>
                  <td className="p-2">
                    <Badge variant="outline">Weak</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Ecologic</td>
                  <td className="p-2">Observational</td>
                  <td className="p-2">Population-level associations</td>
                  <td className="p-2">
                    <Badge variant="outline">Weakest</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

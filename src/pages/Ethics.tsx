import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Scale } from 'lucide-react';

const ethicalPrinciples = [
  {
    id: 'equipoise',
    title: 'Equipoise',
    description:
      'Genuine uncertainty in the medical community about which treatment is superior, justifying randomization.',
    examples: [
      'Clinical equipoise required before starting an RCT',
      'Trial may be stopped early if equipoise is lost',
    ],
  },
  {
    id: 'informed-consent',
    title: 'Informed Consent',
    description:
      'Participants must understand study procedures, risks, benefits, and alternatives before enrolling.',
    examples: [
      'Written consent required for clinical trials',
      'Special protections for vulnerable populations',
    ],
  },
  {
    id: 'beneficence',
    title: 'Beneficence',
    description:
      'Obligation to maximize benefits and minimize harms to research participants.',
    examples: [
      'Risk-benefit ratio must favor participation',
      'Data safety monitoring boards protect participants',
    ],
  },
  {
    id: 'justice',
    title: 'Justice',
    description:
      'Fair distribution of research burdens and benefits across populations.',
    examples: [
      'Ensure diverse representation in trials',
      'Avoid exploitation of vulnerable groups',
    ],
  },
];

export function Ethics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Ethics</h1>
        <p className="text-muted-foreground mt-2">
          Understand ethical principles governing clinical research and study
          design.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Scale className="h-12 w-12 text-primary" />
            <div>
              <CardTitle>Core Ethical Principles</CardTitle>
              <CardDescription>
                Fundamental concepts in research ethics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {ethicalPrinciples.map((principle) => (
          <Card key={principle.id}>
            <CardHeader>
              <CardTitle>{principle.title}</CardTitle>
              <CardDescription>{principle.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Key Considerations:</p>
                <ul className="space-y-1">
                  {principle.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>IRB Review and Approval</CardTitle>
          <CardDescription>
            Institutional Review Board oversight of research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Institutional Review Boards (IRBs) review research protocols to
            ensure ethical conduct and protection of human subjects.
          </p>
          <div>
            <h4 className="font-semibold mb-2">IRB Review Levels:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant="default">Exempt</Badge>
                <span className="text-sm">
                  Minimal risk studies (e.g., anonymous surveys)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">Expedited</Badge>
                <span className="text-sm">
                  Low-risk studies with minor deviations from minimal risk
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline">Full Board</Badge>
                <span className="text-sm">
                  Greater than minimal risk studies requiring full review
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Standards</CardTitle>
          <CardDescription>
            Guidelines for transparent research reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">CONSORT:</span>
              <span className="text-sm">
                Consolidated Standards of Reporting Trials (RCTs)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">STROBE:</span>
              <span className="text-sm">
                Strengthening the Reporting of Observational Studies
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">PRISMA:</span>
              <span className="text-sm">
                Preferred Reporting Items for Systematic Reviews
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

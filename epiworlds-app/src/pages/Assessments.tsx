import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GraduationCap, Clock, CheckCircle } from 'lucide-react';

const assessments = [
  {
    id: 'study-design-basics',
    title: 'Study Design Fundamentals',
    description: 'Test your understanding of different epidemiologic study designs',
    questions: 15,
    timeLimit: 20,
    difficulty: 'beginner',
    topics: ['RCTs', 'Cohort Studies', 'Case-Control', 'Cross-Sectional'],
  },
  {
    id: 'bias-identification',
    title: 'Bias Identification',
    description: 'Identify types of bias in research scenarios',
    questions: 20,
    timeLimit: 25,
    difficulty: 'intermediate',
    topics: ['Selection Bias', 'Information Bias', 'Confounding'],
  },
  {
    id: 'dag-interpretation',
    title: 'DAG Interpretation',
    description: 'Analyze causal diagrams and identify adjustment strategies',
    questions: 12,
    timeLimit: 30,
    difficulty: 'advanced',
    topics: ['Confounders', 'Colliders', 'Mediators', 'Backdoor Paths'],
  },
  {
    id: 'effect-modification',
    title: 'Confounding vs Effect Modification',
    description: 'Distinguish between confounding and effect modification',
    questions: 10,
    timeLimit: 15,
    difficulty: 'intermediate',
    topics: ['Stratification', 'Interaction', 'Adjustment'],
  },
];

export function Assessments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assessment Hub</h1>
        <p className="text-muted-foreground mt-2">
          Test your knowledge and track your progress through interactive quizzes
          and case studies.
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <GraduationCap className="h-8 w-8 text-primary" />
                <Badge
                  variant={
                    assessment.difficulty === 'beginner'
                      ? 'default'
                      : assessment.difficulty === 'intermediate'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {assessment.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl mt-4">{assessment.title}</CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {assessment.questions} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {assessment.timeLimit} min
                </span>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Topics covered:</p>
                <div className="flex flex-wrap gap-2">
                  {assessment.topics.map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-auto">Start Assessment</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How Assessments Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                Select an assessment based on your current learning level
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                Answer multiple-choice and scenario-based questions within the
                time limit
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                Receive immediate feedback with detailed explanations for each
                answer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                Review your results and identify areas for further study
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

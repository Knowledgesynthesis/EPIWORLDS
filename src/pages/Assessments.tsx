import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GraduationCap, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { assessments } from '../data/assessmentQuestions';
import { QuizComponent } from '../components/modules/QuizComponent';
import { useProgressStore } from '../stores/useProgressStore';
import type { Assessment } from '../types';

export function Assessments() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const { assessmentScores, setAssessmentScore } = useProgressStore();

  const handleStartAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleBackToList = () => {
    setSelectedAssessment(null);
  };

  const handleQuizComplete = (score: number) => {
    if (selectedAssessment) {
      setAssessmentScore(selectedAssessment.id, score);
    }
  };

  if (selectedAssessment) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{selectedAssessment.title}</h1>
          <p className="text-muted-foreground mt-2">
            {selectedAssessment.description}
          </p>
        </div>
        <QuizComponent
          assessment={selectedAssessment}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }
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
        {assessments.map((assessment) => {
          const previousScore = assessmentScores[assessment.id];
          const categories = new Set(assessment.questions.map((q) => q.category));

          return (
            <Card key={assessment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">
                      {assessment.questions.find((q) => q.difficulty)?.difficulty ||
                        'intermediate'}
                    </Badge>
                    {previousScore !== undefined && (
                      <Badge
                        variant={
                          previousScore >= assessment.passingScore
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        Best: {previousScore.toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl mt-4">{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {assessment.questions.length} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {assessment.timeLimit} min
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Topics covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(categories).map((topic) => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full mt-auto"
                  onClick={() => handleStartAssessment(assessment)}
                >
                  {previousScore !== undefined ? 'Retry Assessment' : 'Start Assessment'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
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

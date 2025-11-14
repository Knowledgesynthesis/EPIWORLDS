import { useState } from 'react';
import type { Assessment } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizComponentProps {
  assessment: Assessment;
  onComplete: (score: number) => void;
}

export function QuizComponent({ assessment, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
    setShowExplanation(false);
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const completeQuiz = () => {
    const correctAnswers = assessment.questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const score = (correctAnswers / totalQuestions) * 100;
    setQuizCompleted(true);
    onComplete(score);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  if (quizCompleted) {
    const correctAnswers = assessment.questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= assessment.passingScore;
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000 / 60);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </div>
            {passed ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-primary">{score.toFixed(0)}%</div>
            <p className="text-muted-foreground mt-2">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>

          {/* Pass/Fail Status */}
          <div className="text-center">
            {passed ? (
              <Badge variant="default" className="text-lg px-4 py-2">
                Passed! (Required: {assessment.passingScore}%)
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Keep Studying (Required: {assessment.passingScore}%)
              </Badge>
            )}
          </div>

          {/* Time Taken */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Completed in {timeElapsed} minutes</span>
          </div>

          {/* Question Review */}
          <div>
            <h3 className="font-semibold mb-3">Question Review:</h3>
            <div className="space-y-2">
              {assessment.questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <span className="text-sm">
                      Question {index + 1}: {question.question.substring(0, 50)}...
                    </span>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={restartQuiz} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge variant="outline" className="mb-2">
                {currentQuestion.difficulty}
              </Badge>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQuestion.correctAnswer;
              const showCorrectness = showExplanation && isSelected;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 border rounded-md transition-colors ${
                    isSelected
                      ? showCorrectness
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-primary bg-accent'
                      : 'border-border hover:border-primary hover:bg-accent'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showExplanation && isSelected && (
                      isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    )}
                    {showExplanation && !isSelected && isCorrectOption && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-4 rounded-md ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-950 border border-green-500'
                  : 'bg-red-50 dark:bg-red-950 border border-red-500'
              }`}
            >
              <h4 className="font-semibold mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {!showExplanation ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className="flex-1"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                {currentQuestionIndex === totalQuestions - 1 ? (
                  'Complete Quiz'
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

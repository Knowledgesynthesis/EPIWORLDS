import { Link } from 'react-router-dom';
import {
  BookOpen,
  Microscope,
  Network,
  FlaskConical,
  GraduationCap,
  BookMarked,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const modules = [
  {
    id: 'study-designs',
    title: 'Study Design Explorer',
    description:
      'Learn about RCTs, cohort studies, case-control studies, and more. Understand strengths, limitations, and when to use each design.',
    icon: BookOpen,
    path: '/study-designs',
    color: 'text-blue-500',
    level: 'Beginner',
  },
  {
    id: 'bias-lab',
    title: 'Bias Visualization Lab',
    description:
      'Interactive visualizations showing how selection bias, information bias, and confounding distort study results.',
    icon: Microscope,
    path: '/bias-lab',
    color: 'text-purple-500',
    level: 'Intermediate',
  },
  {
    id: 'dag-builder',
    title: 'Causal DAG Builder',
    description:
      'Build directed acyclic graphs to represent causal relationships. Identify confounders, colliders, and mediators.',
    icon: Network,
    path: '/dag-builder',
    color: 'text-green-500',
    level: 'Advanced',
  },
  {
    id: 'confounding-lab',
    title: 'Confounding & Effect Modification',
    description:
      'Explore the difference between confounding and effect modification through interactive examples and stratification.',
    icon: FlaskConical,
    path: '/confounding-lab',
    color: 'text-orange-500',
    level: 'Intermediate',
  },
  {
    id: 'study-sandbox',
    title: 'Study Design Sandbox',
    description:
      'Design your own studies, manipulate variables, and see how design choices affect validity and bias.',
    icon: GraduationCap,
    path: '/study-sandbox',
    color: 'text-red-500',
    level: 'Advanced',
  },
  {
    id: 'glossary',
    title: 'Glossary',
    description:
      'Comprehensive definitions of epidemiologic terms with examples and related concepts.',
    icon: BookMarked,
    path: '/glossary',
    color: 'text-indigo-500',
    level: 'All Levels',
  },
  {
    id: 'ethics',
    title: 'Research Ethics',
    description:
      'Explore ethical considerations in study design, including equipoise, informed consent, and research integrity.',
    icon: Scale,
    path: '/ethics',
    color: 'text-teal-500',
    level: 'All Levels',
  },
  {
    id: 'assessments',
    title: 'Assessment Hub',
    description:
      'Test your knowledge with quizzes covering study design, bias, confounding, and causal inference.',
    icon: GraduationCap,
    path: '/assessments',
    color: 'text-pink-500',
    level: 'All Levels',
  },
];

export function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to EpiWorlds
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A comprehensive, interactive learning environment for mastering
          epidemiology—from study design to causal inference. Built for
          clinicians, researchers, and public health professionals.
        </p>
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Why EpiWorlds?</CardTitle>
          <CardDescription>
            Clinical epidemiology made intuitive through interactive learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold">Interactive Learning</h3>
              <p className="text-sm text-muted-foreground">
                Build DAGs, visualize bias, and design studies in real-time
                sandboxes.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Clinically Rigorous</h3>
              <p className="text-sm text-muted-foreground">
                Evidence-based content aligned with STROBE, CONSORT, and modern
                causal inference frameworks.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Offline-Ready</h3>
              <p className="text-sm text-muted-foreground">
                Access all content offline. Dark mode optimized for late-night
                study sessions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Learning Modules</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className={`h-8 w-8 ${module.color}`} />
                    <Badge variant="outline">{module.level}</Badge>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link to={module.path}>
                    <Button className="w-full" variant="outline">
                      Explore Module
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Learning Path Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Learning Path</CardTitle>
          <CardDescription>
            New to epidemiology? Follow this sequence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </span>
              <span>Start with <strong>Glossary</strong> to build foundational vocabulary</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </span>
              <span>Explore <strong>Study Design Explorer</strong> to understand different study types</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </span>
              <span>Master <strong>Bias Visualization Lab</strong> to recognize sources of error</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                4
              </span>
              <span>Learn <strong>Confounding & Effect Modification</strong> concepts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                5
              </span>
              <span>Build causal intuition with <strong>DAG Builder</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                6
              </span>
              <span>Practice in the <strong>Study Sandbox</strong> and test knowledge with <strong>Assessments</strong></span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const DagLab = lazy(() => import('./pages/DagLab'));
const ConfoundingLab = lazy(() => import('./pages/ConfoundingLab'));
const BiasLab = lazy(() => import('./pages/BiasLab'));
const StudySimulator = lazy(() => import('./pages/StudySimulator'));
const Calculators = lazy(() => import('./pages/Calculators'));
const StudyDesigns = lazy(() => import('./pages/StudyDesigns'));
const Ethics = lazy(() => import('./pages/Ethics'));
const Practice = lazy(() => import('./pages/Practice'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Reference = lazy(() => import('./pages/Reference'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground" role="status">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:moduleId" element={<ModulePage />} />
            <Route path="/dag-builder" element={<DagLab />} />
            <Route path="/confounding-lab" element={<ConfoundingLab />} />
            <Route path="/bias-lab" element={<BiasLab />} />
            <Route path="/study-sandbox" element={<StudySimulator />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/study-designs" element={<StudyDesigns />} />
            <Route path="/ethics" element={<Ethics />} />
            <Route path="/assessments" element={<Practice />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/reference" element={<Reference />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

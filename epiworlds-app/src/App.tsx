import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { StudyDesigns } from './pages/StudyDesigns';
import { BiasLab } from './pages/BiasLab';
import { DAGBuilder } from './pages/DAGBuilder';
import { ConfoundingLab } from './pages/ConfoundingLab';
import { StudySandbox } from './pages/StudySandbox';
import { Assessments } from './pages/Assessments';
import { Glossary } from './pages/Glossary';
import { Ethics } from './pages/Ethics';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study-designs" element={<StudyDesigns />} />
          <Route path="/bias-lab" element={<BiasLab />} />
          <Route path="/dag-builder" element={<DAGBuilder />} />
          <Route path="/confounding-lab" element={<ConfoundingLab />} />
          <Route path="/study-sandbox" element={<StudySandbox />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/ethics" element={<Ethics />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

# EpiWorlds - From Study Design to Causation

**A comprehensive, interactive learning environment for mastering clinical epidemiology** — built for clinicians, researchers, and public health professionals.

![React](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-4.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.2-purple)

---

## 🎯 Vision

EpiWorlds transforms how clinicians learn epidemiology. Instead of passive reading, learners actively build studies, visualize bias, construct causal diagrams, and explore complex concepts through interactive sandboxes.

---

## ✨ Features

### 📚 **Study Design Explorer**
- Comprehensive overview of RCTs, cohort studies, case-control studies, cross-sectional, and ecologic designs
- Side-by-side comparisons of strengths, limitations, and real-world examples
- Interactive study design selector

### 🔬 **Bias Visualization Lab**
- Explore 8+ types of bias (selection, information, confounding, recall, observer, etc.)
- Understand bias direction (towards null, away from null, unpredictable)
- Prevention strategies for each bias type

### 🔀 **Causal DAG Builder**
- Build directed acyclic graphs from scratch
- Add nodes (variables) and edges (causal relationships)
- Real-time SVG visualization with cycle detection

### 🎓 **Assessment Hub**
- Multiple choice and scenario-based questions
- Difficulty levels: Beginner, Intermediate, Advanced
- Topics: Study designs, bias identification, DAG interpretation, confounding

### 📖 **Comprehensive Glossary**
- 20+ epidemiologic terms with definitions
- Searchable by term, definition, or synonym
- Filterable by category

### ⚖️ **Research Ethics Module**
- Core ethical principles: Equipoise, Informed Consent, Beneficence, Justice
- IRB review levels
- Reporting standards (CONSORT, STROBE, PRISMA)

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm

### **Installation**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

---

## 🏗️ Technical Architecture

### **Tech Stack**
- **Framework**: React 19.2 with TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Icons**: Lucide React

### **Key Features**
- **Dark Mode**: System-aware with manual toggle
- **Mobile-First**: Responsive design optimized for all devices
- **Type-Safe**: Full TypeScript coverage
- **Performance**: Code splitting with React Router

---

## 📚 Learning Modules

1. **Study Design Explorer** - Learn about different epidemiologic study designs
2. **Bias Visualization Lab** - Understand how bias affects study results
3. **Causal DAG Builder** - Build and analyze directed acyclic graphs
4. **Confounding & Effect Modification Lab** - Practice distinguishing confounding from effect modification
5. **Assessment Hub** - Test your knowledge with quizzes
6. **Glossary** - Quick reference for key epidemiologic terms
7. **Research Ethics** - Understand ethical principles governing clinical research

---

## 🗺️ Roadmap

### **Phase 1: Foundation** ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Core UI components and navigation
- [x] Dark mode support
- [x] State management

### **Phase 2: Core Modules** ✅
- [x] Study Design Explorer
- [x] Bias Visualization Lab
- [x] DAG Builder with SVG rendering
- [x] Glossary with search
- [x] Assessment Hub structure
- [x] Ethics module

### **Phase 3: Interactivity** (Planned)
- [ ] Interactive bias simulations
- [ ] Confounding lab with stratification calculator
- [ ] Study sandbox with parameter manipulation
- [ ] Complete assessment questions with feedback

### **Phase 4: Advanced Features** (Planned)
- [ ] Offline support with Service Worker
- [ ] Synthetic dataset generator
- [ ] Advanced DAG analysis
- [ ] User progress tracking
- [ ] Data visualization with Recharts

---

## 📖 Educational Standards

EpiWorlds is aligned with:
- **STROBE** - Strengthening the Reporting of Observational Studies in Epidemiology
- **CONSORT** - Consolidated Standards of Reporting Trials
- **EQUATOR Network** guidelines
- Modern causal inference frameworks (Hernán & Robins)

---

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for clinicians, by educators committed to excellent epidemiology training.**

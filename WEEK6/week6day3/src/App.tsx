import Counter from './components/Counter';
import StudentCard from './components/StudentCard';

function App() {
  return (
    <main className="app">
      <h1>Student Profile</h1>
      <StudentCard name="Aarav Sharma" role="Frontend Development Intern" />
      <h2>Interactive Counter</h2>
      <Counter />
    </main>
  );
}

export default App;

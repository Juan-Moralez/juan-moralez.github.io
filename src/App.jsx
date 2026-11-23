
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/about';
import Projects from './components/Projects';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
    </>
  );
}

export default App;

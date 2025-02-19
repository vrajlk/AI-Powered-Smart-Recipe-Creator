import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RecipeGenerator from './components/RecipeGenerator';
import './App.css';
import CylindersGrid from './components/CylindersGrid';
 

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
     <>
     <div className="glass-effect">

    
    <div className={`min-h-screen `}>
     <CylindersGrid />
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto px-4 glass-effect">
        <Hero />
        <RecipeGenerator />
      </main>
    </div>
    </div>
    </>
  );
}

export default App;
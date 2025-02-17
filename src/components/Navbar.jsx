import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

function Navbar({ isDarkMode, toggleDarkMode }) {
  return (
    <nav className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold"
          >
            Smart Recipe Generator
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import { motion } from 'framer-motion';

function Hero() {
  return (
    <section className="py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Turn Ingredients into
          <span className="text-primary"> Delicious Meals</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Enter your available ingredients and let AI create the perfect recipe for you
        </p>
        <motion.a
          href="#recipe-generator"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors"
        >
          Get Started
        </motion.a>
      </motion.div>
    </section>
  );
}

export default Hero;
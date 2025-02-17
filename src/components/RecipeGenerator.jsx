import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaRandom } from 'react-icons/fa';
import { generateRecipe, getRecipeImage } from '../services/api';
import RecipeCard from './RecipeCard';

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [recipeImage, setRecipeImage] = useState(null);
  const [warning, setWarning] = useState('');

  const generateRandomIngredients = () => {
    const commonIngredients = [
      'chicken', 'beef', 'pasta', 'rice', 'potatoes',
      'tomatoes', 'onions', 'garlic', 'carrots', 'bell peppers'
    ];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 ingredients
    const randomIngredients = [];
    
    while (randomIngredients.length < count) {
      const ingredient = commonIngredients[Math.floor(Math.random() * commonIngredients.length)];
      if (!randomIngredients.includes(ingredient)) {
        randomIngredients.push(ingredient);
      }
    }
    
    setIngredients(randomIngredients.join(', '));
    setWarning('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setWarning('');
    setRecipe(null);
    setRecipeImage(null);

    try {
      const generatedRecipe = await generateRecipe(ingredients);
      setRecipe(generatedRecipe);
      
      if (generatedRecipe.warning) {
        setWarning(generatedRecipe.warning);
      }
      
      if (generatedRecipe.title) {
        const image = await getRecipeImage(generatedRecipe.title);
        setRecipeImage(image);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      setWarning('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="recipe-generator" className="py-12">
      <div className="max-w-2xl mx-auto">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium mb-2">
              Enter your ingredients (separated by commas)
            </label>
            <div className="relative">
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="4"
                placeholder="e.g., chicken, rice, tomatoes, onions"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={generateRandomIngredients}
                className="absolute right-2 top-2 p-2 text-gray-500 hover:text-primary"
                title="Generate random ingredients"
              >
                <FaRandom />
              </motion.button>
            </div>
          </div>

          {warning && (
            <div className="text-yellow-700 text-sm p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              {warning}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !ingredients.trim()}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              'Generate Recipe'
            )}
          </motion.button>
        </motion.form>

        {recipe && (
          <div className="mt-8">
            <RecipeCard recipe={recipe} image={recipeImage} />
          </div>
        )}
      </div>
    </section>
  );
}

export default RecipeGenerator;
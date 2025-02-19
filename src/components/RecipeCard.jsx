import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaUsers, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';

function RecipeCard({ recipe, image }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    
    if (!isFavorite) {
      favorites.push(recipe);
    } else {
      const index = favorites.findIndex(r => r.title === recipe.title);
      if (index > -1) favorites.splice(index, 1);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  };

  const shareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe for ${recipe.title}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white rounded-lg shadow-xl overflow-hidden"
    >
      {image && (
        <img
          src={image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{recipe.title}</h2>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className="text-red-500"
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={shareRecipe}
              className="text-blue-500"
            >
              <FaShare />
            </motion.button>
          </div>
        </div>

        <div className="flex gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <FaClock />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUsers />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </motion.div>
  );
}

export default RecipeCard;
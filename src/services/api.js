import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY
  }
});

const basicRecipes = {
  chicken: {
    instructions: [
      'Season the chicken with salt and pepper',
      'Heat oil in a pan over medium heat',
      'Cook chicken for 6-7 minutes per side until golden',
      'Let rest for 5 minutes before serving'
    ],
    cookingTime: '25 minutes'
  },
  beef: {
    instructions: [
      'Season the beef with salt and pepper',
      'Heat a pan until very hot',
      'Sear beef for 3-4 minutes per side for medium-rare',
      'Rest for 5-10 minutes before serving'
    ],
    cookingTime: '20 minutes'
  },
  pasta: {
    instructions: [
      'Boil water with salt',
      'Cook pasta according to package instructions',
      'Drain and combine with sauce',
      'Season to taste'
    ],
    cookingTime: '15 minutes'
  }
};

const fallbackRecipeGenerator = (ingredients) => {
  const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());
  const mainIngredient = ingredientList[0];
  
  // Find if we have a basic recipe for the main ingredient
  const baseRecipe = Object.keys(basicRecipes).find(key => mainIngredient.includes(key));
  const recipeBase = baseRecipe ? basicRecipes[baseRecipe] : null;
  
  const measurements = {
    meat: '400g',
    vegetables: '2 cups',
    spices: '1 teaspoon',
    liquid: '1 cup'
  };

  // Generate appropriate measurements for ingredients
  const formattedIngredients = ingredientList.map(ingredient => {
    if (ingredient.includes('chicken') || ingredient.includes('beef') || ingredient.includes('fish')) {
      return `${measurements.meat} ${ingredient}`;
    } else if (ingredient.includes('salt') || ingredient.includes('pepper') || ingredient.includes('spice')) {
      return `${measurements.spices} ${ingredient}`;
    } else if (ingredient.includes('water') || ingredient.includes('broth') || ingredient.includes('sauce')) {
      return `${measurements.liquid} ${ingredient}`;
    } else {
      return `${measurements.vegetables} ${ingredient}`;
    }
  });

  // Generate a more specific title based on ingredients
  const title = `${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} with ${
    ingredientList.slice(1).join(' and ')
  }`;

  // Use basic recipe instructions if available, otherwise generate generic ones
  const instructions = recipeBase ? recipeBase.instructions : [
    `Prepare all ingredients: ${ingredientList.join(', ')}`,
    `Heat a pan over medium heat`,
    `Cook ${mainIngredient} as the main ingredient`,
    'Add remaining ingredients and combine',
    'Season to taste with salt and pepper',
    'Cook until all ingredients are done',
    'Serve hot'
  ];

  return {
    title,
    ingredients: formattedIngredients,
    instructions,
    cookingTime: recipeBase ? recipeBase.cookingTime : '30 minutes',
    servings: '4'
  };
};

export const generateRecipe = async (ingredients) => {
  try {
    const prompt = `Create a recipe using these ingredients: ${ingredients}. 
      Include title, ingredients list with measurements, step-by-step instructions, cooking time, and servings.
      Format the response in JSON with the following structure:
      {
        "title": "",
        "ingredients": [],
        "instructions": [],
        "cookingTime": "",
        "servings": ""
      }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return fallbackRecipeGenerator(ingredients);
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    // Instead of throwing errors, return fallback recipe with a warning
    const recipe = fallbackRecipeGenerator(ingredients);
    recipe.warning = error.code === 'insufficient_quota' 
      ? 'Using basic recipe generator due to API limitations. For more creative recipes, please try again later.'
      : 'Using basic recipe generator. For more creative recipes, please try again.';
    return recipe;
  }
};

export const getRecipeImage = async (query) => {
  try {
    const response = await spoonacular.get('/complexSearch', {
      params: {
        query,
        number: 1
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].image;
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe image:', error);
    if (error.response?.status === 401 || error.response?.status === 402) {
      console.error('Invalid Spoonacular API key or quota exceeded');
    }
    return null;
  }
};
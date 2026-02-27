import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFoodContext } from './FoodContext';

export interface Recipe {
  id: number;
  name: string;
  image: string;
  level: 'Fácil' | 'Medio' | 'Difícil';
  time: number;
  ingredients: string[];
  instructions: string[];
}

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: number, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: number) => void;
  getIngredientsMatch: (recipeIngredients: string[]) => number;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const STORAGE_KEY = '@my_fridge_recipes';

export function RecipeProvider({ children }: { children: ReactNode }) {
  const { foods } = useFoodContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveRecipes = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error('Error saving recipes:', error);
    }
  }, [recipes]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRecipes) {
          const parsedRecipes = JSON.parse(storedRecipes);
          setRecipes(parsedRecipes);
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadRecipes();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveRecipes();
    }
  }, [recipes, isLoaded, saveRecipes]);

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe = {
      ...recipe,
      id: Date.now(),
    };
    setRecipes([...recipes, newRecipe]);
  };

  const updateRecipe = (id: number, updatedRecipe: Partial<Recipe>) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
    ));
  };

  const deleteRecipe = (id: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const getIngredientsMatch = (recipeIngredients: string[]): number => {
    if (recipeIngredients.length === 0) return 0;

    const normalize = (str: string) => 
      str.toLowerCase()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, ''); 

    const availableFoods = foods.map(food => normalize(food.name));

    let matchCount = 0;
    recipeIngredients.forEach(ingredient => {
      const normalizedIngredient = normalize(ingredient);
      
      const hasIngredient = availableFoods.some(food => 
        food.includes(normalizedIngredient) || normalizedIngredient.includes(food)
      );
      
      if (hasIngredient) {
        matchCount++;
      }
    });

    return Math.round((matchCount / recipeIngredients.length) * 100);
  };

  return (
    <RecipeContext.Provider value={{ 
      recipes, 
      addRecipe, 
      updateRecipe, 
      deleteRecipe,
      getIngredientsMatch 
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext debe usarse dentro de RecipeProvider');
  }
  return context;
}
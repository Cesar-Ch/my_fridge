import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Food {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: Date;
}

interface FoodContextType {
  foods: Food[];
  addFood: (food: Omit<Food, 'id'>) => void;
  updateFood: (id: number, food: Partial<Food>) => void;
  deleteFood: (id: number) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

const STORAGE_KEY = '@my_fridge_foods';

export function FoodProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveFoods = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
    } catch (error) {
      console.error('Error saving foods:', error);
    }
  }, [foods]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const storedFoods = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedFoods) {
          const parsedFoods = JSON.parse(storedFoods);
          // Convertir las fechas de string a Date
          const foodsWithDates = parsedFoods.map((food: any) => ({
            ...food,
            expiryDate: new Date(food.expiryDate),
          }));
          setFoods(foodsWithDates);
        }
      } catch (error) {
        console.error('Error loading foods:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFoods();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveFoods();
    }
  }, [foods, isLoaded, saveFoods]);

  const addFood = (food: Omit<Food, 'id'>) => {
    const newFood = {
      ...food,
      id: Date.now(),
    };
    setFoods([...foods, newFood]);
  };

  const updateFood = (id: number, updatedFood: Partial<Food>) => {
    setFoods(foods.map(food => 
      food.id === id ? { ...food, ...updatedFood } : food
    ));
  };

  const deleteFood = (id: number) => {
    setFoods(foods.filter(food => food.id !== id));
  };

  return (
    <FoodContext.Provider value={{ foods, addFood, updateFood, deleteFood }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFoodContext() {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext debe usarse dentro de FoodProvider');
  }
  return context;
}
import { Stack } from "expo-router";
import { FoodProvider } from '@/context/FoodContext';
import { RecipeProvider } from '@/context/RecipeContext';
import '../global.css'


export default function RootLayout() {
  return (
    <FoodProvider>
      <RecipeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </RecipeProvider>
    </FoodProvider>
  )
}
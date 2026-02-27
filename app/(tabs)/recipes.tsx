import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FloatingButton from '@/components/floating-button';
import { useRecipeContext } from '@/context/RecipeContext';
import { useRouter } from 'expo-router';

export default function RecipesScreen() {
  const router = useRouter();
  const { recipes, deleteRecipe, getIngredientsMatch } = useRecipeContext();

  const handleAddRecipe = () => {
    router.push('/add-recipe');
  };

  const handleSelectRecipe = (recipeId: number) => {
    router.push(`/edit-recipe?id=${recipeId}`);
  };

  const handleDeleteRecipe = (recipeId: number, recipeName: string) => {
    Alert.alert(
      'Eliminar receta',
      `¿Estás seguro de eliminar "${recipeName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteRecipe(recipeId);
            Alert.alert('Eliminado', 'La receta ha sido eliminada');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 px-4 bg-[#0a0f14]" >
      <Text className="text-3xl font-bold text-start mt-16 mb-8 text-white">
        What to cook
      </Text>

      <ScrollView className="flex-1">
        {recipes.length === 0 && (
          <View className="flex-1 items-center justify-center mt-10">
            <Feather name="book-open" size={64} color="#00ff9d" />
            <Text className="text-white text-xl mt-4">No hay recetas</Text>
            <Text className="text-gray-400 mt-2 text-center">
              Crea tu primera receta para comenzar
            </Text>
          </View>
        )}
        {recipes.map((recipe) => {
          const ingredientsMatch = getIngredientsMatch(recipe.ingredients);
          
          return (
            <TouchableOpacity
              key={recipe.id}
              onPress={() => handleSelectRecipe(recipe.id)}
              className="bg-gray-800 rounded-lg mb-4 overflow-hidden"
            >
              <Image
                source={{ uri: recipe.image }}
                className="w-full h-48"
                resizeMode="cover"
              />

              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-xl font-semibold text-white flex-1">
                    {recipe.name}
                  </Text>

                  {/* 🔥 Botón eliminar */}
                  <TouchableOpacity
                    onPress={() => handleDeleteRecipe(recipe.id, recipe.name)}
                    className="ml-2 p-2"
                  >
                    <Feather name="trash-2" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-3">
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="flame" size={16} color="#10b981" />
                    <Text className="text-gray-300 ml-1">{recipe.level}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#10b981" />
                    <Text className="text-gray-300 ml-1">{recipe.time} min</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-gray-400 text-sm mb-1">
                    Ingredientes disponibles: {ingredientsMatch}%
                  </Text>
                  <View className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${ingredientsMatch}%` }}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FloatingButton onPress={handleAddRecipe} />
    </View>
  );
}
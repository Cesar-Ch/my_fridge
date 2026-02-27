import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FloatingButton from '@/components/floating-button';
import { useRouter } from 'expo-router';
import { useFoodContext } from '@/context/FoodContext';

export default function FoodScreen() {
  const router = useRouter();
  const { foods, deleteFood } = useFoodContext();

  const getDaysRemaining = (expiryDate: Date): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEditFood = (foodId: number) => {
    router.push(`/edit-food?id=${foodId}`);
  };

  const handleDeleteFood = (foodId: number, foodName: string) => {
    Alert.alert(
      'Eliminar alimento',
      `¿Estás seguro de eliminar "${foodName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteFood(foodId);
          },
        },
      ]
    );
  };

  const handleAddFood = () => {
    router.push('/add-food');
  };

  return (
    <View className="flex-1 bg-[#0a0f14] px-4">
      <Text className="text-3xl font-bold text-start mt-16 text-black dark:text-white">
        My fridge
      </Text>
      <ScrollView className="mt-4">
        {foods.length === 0 && (
          <View className="flex-1 items-center justify-center mt-10">
            <Feather name="clipboard" size={64} color="#00ff9d" />
            <Text className="text-white text-xl mt-4">No hay alimentos</Text>
            <Text className="text-gray-400 mt-2 text-center">
              Agrega tu primer alimento para comenzar
            </Text>
          </View>
        )}
        {foods.map((food) => {
          const daysRemaining = getDaysRemaining(food.expiryDate);
          const isExpiringSoon = daysRemaining <= 3;

          return (
            <View key={food.id} className="bg-gray-800 p-4 mb-3 rounded-lg">
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-xl font-semibold text-white">
                    {food.name}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {food.category}
                  </Text>
                </View>

                <View className={`px-3 py-1 rounded-full ${isExpiringSoon ? 'bg-red-500' : 'bg-[#00ff9d]'}`}>
                  <Text className={`text-xs font-semibold ${isExpiringSoon ? 'text-white' : 'text-black'}`}>
                    {daysRemaining} días
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-gray-300 text-base">
                  {food.quantity} {food.unit}
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleEditFood(food.id)}
                    className="bg-[#00ff9d] px-4 py-2 rounded-lg"
                  >
                    <Feather name="edit" size={20} color="#131b24" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteFood(food.id, food.name)}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                  >
                    <Feather name="trash-2" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <FloatingButton onPress={handleAddFood} />
    </View>
  );
}
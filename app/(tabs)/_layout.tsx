import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#131b23",
          borderTopWidth: 0, 
          paddingTop: 8,
          paddingBottom:8,
          height: 70
        },
        sceneStyle: {
          backgroundColor: '#131b23',
        },
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Food',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <MaterialIcons name="restaurant-menu" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

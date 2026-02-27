import { TouchableOpacity, Text } from 'react-native';

interface FloatingButtonProps {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-8 right-8 bg-[#00ff9d] w-16 h-16 rounded-full items-center justify-center shadow-lg"
    >
      <Text className="text-[#0a0f14] text-4xl font-light">+</Text>
    </TouchableOpacity>
  );
}
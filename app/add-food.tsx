import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFoodContext } from '@/context/FoodContext';

export default function AddFoodScreen() {
    const router = useRouter();
    const { addFood } = useFoodContext(); 

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState('unidades');
    const [category, setCategory] = useState('');
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

   
    const [errors, setErrors] = useState({
        name: false,
        category: false,
    });

    const units = ['unidades', 'kg', 'litros'];
    const categories = ['Frutas', 'Verduras', 'Carnes', 'Pescados', 'Tubérculos', 'Frutos Secos'];

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity(quantity + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setExpiryDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const validateForm = (): boolean => {
        const newErrors = {
            name: name.trim() === '',
            category: category === '',
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.category) {
            Alert.alert(
                'Campos requeridos',
                'Por favor completa todos los campos obligatorios',
                [{ text: 'OK' }]
            );
            return false;
        }

        return true;
    };

    const handleAddFood = () => {
        if (!validateForm()) {
            return;
        }

        addFood({
            name: name.trim(),
            quantity,
            unit,
            category,
            expiryDate,
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-[#131b23] pt-5">
            <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-2">Add Food</Text>
            </View>

            <View className="flex-1" style={{ backgroundColor: '#131b23' }}>
                <ScrollView className="flex-1 px-4 pt-4">
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-white text-sm font-semibold">Item name</Text>
                            <Text className="text-red-500 ml-1">*</Text>
                        </View>
                        <TextInput
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                if (errors.name && text.trim() !== '') {
                                    setErrors({ ...errors, name: false });
                                }
                            }}
                            placeholder="e.g. Apples"
                            placeholderTextColor="#6b7280"
                            className={`bg-gray-800 text-white px-4 py-3 rounded-lg ${
                                errors.name ? 'border-2 border-red-500' : ''
                            }`}
                        />
                        {errors.name && (
                            <Text className="text-red-500 text-xs mt-1">Este campo es requerido</Text>
                        )}
                    </View>

                    <View className="mb-6">
                        <Text className="text-white text-sm mb-2 font-semibold">Quantity</Text>
                        <View className="flex-row items-center bg-gray-800 rounded-lg p-2">
                            <TouchableOpacity
                                onPress={() => handleQuantityChange('decrease')}
                                className="bg-gray-700 w-10 h-10 rounded-lg items-center justify-center"
                            >
                                <Text className="text-white text-xl">-</Text>
                            </TouchableOpacity>

                            <TextInput 
                                value={quantity.toString()}
                                onChangeText={(text) => {
                                    const num = parseInt(text);
                                    if (!isNaN(num) && num > 0) {
                                        setQuantity(num);
                                    } else if (text === '') {
                                        setQuantity(1);
                                    }
                                }}
                                keyboardType="numeric"
                                className="flex-1 text-center text-white text-lg"
                            />

                            <TouchableOpacity
                                onPress={() => handleQuantityChange('increase')}
                                className="bg-[#00ff9d] w-10 h-10 rounded-lg items-center justify-center"
                            >
                                <Text className="text-black text-xl">+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-white text-sm mb-2 font-semibold">Unit</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {units.map((u) => (
                                <TouchableOpacity
                                    key={u}
                                    onPress={() => setUnit(u)}
                                    className={`px-4 py-2 rounded-lg ${
                                        unit === u ? 'bg-[#00ff9d]' : 'bg-gray-800'
                                    }`}
                                >
                                    <Text className={`${unit === u ? 'text-black' : 'text-white'}`}>
                                        {u}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                   
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-white text-sm font-semibold">Category</Text>
                            <Text className="text-red-500 ml-1">*</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => {
                                        setCategory(cat);
                                        if (errors.category) {
                                            setErrors({ ...errors, category: false });
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-lg ${
                                        category === cat ? 'bg-[#00ff9d]' : 'bg-gray-800'
                                    } ${errors.category && category !== cat ? 'border border-red-500' : ''}`}
                                >
                                    <Text className={`${category === cat ? 'text-black' : 'text-white'}`}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.category && (
                            <Text className="text-red-500 text-xs mt-1">Debes seleccionar una categoría</Text>
                        )}
                    </View>

                    <View className="mb-6">
                        <Text className="text-white text-sm mb-2 font-semibold">Expiry date</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-gray-800 px-4 py-3 rounded-lg flex-row items-center justify-between"
                        >
                            <Text className="text-white">{formatDate(expiryDate)}</Text>
                            <Feather name="calendar" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={expiryDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                            textColor="#ff0000"
                            accentColor="#FF5722"
                            themeVariant="dark"
                        />
                    )}

                    <TouchableOpacity
                        onPress={handleAddFood}
                        className="bg-[#00ff9d] py-4 rounded-lg items-center mb-8"
                    >
                        <Text className="text-black text-lg font-bold">Add to fridge</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}
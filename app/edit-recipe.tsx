import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeContext } from '@/context/RecipeContext';

export default function EditRecipeScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // 🔥 Obtener ID de la URL
    const { recipes, updateRecipe } = useRecipeContext();

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [level, setLevel] = useState<'Fácil' | 'Medio' | 'Difícil'>('Fácil');
    const [time, setTime] = useState(15);
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const [showUrlModal, setShowUrlModal] = useState(false);
    const [tempUrl, setTempUrl] = useState('');

    const [errors, setErrors] = useState({
        name: false,
        ingredients: false,
        instructions: false,
    });

    // 🔥 Cargar datos de la receta al abrir
    useEffect(() => {
        const recipeId = Number(id);
        const recipe = recipes.find(r => r.id === recipeId);
        
        if (recipe) {
            setName(recipe.name);
            setImage(recipe.image);
            setLevel(recipe.level);
            setTime(recipe.time);
            setIngredients(recipe.ingredients.join('\n')); // Array → String con saltos de línea
            setInstructions(recipe.instructions.join('\n'));
        } else {
            Alert.alert('Error', 'Receta no encontrada');
            router.back();
        }
    }, [id, recipes,router]);

    const levels: ('Fácil' | 'Medio' | 'Difícil')[] = ['Fácil', 'Medio', 'Difícil'];

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a tus fotos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        
        if (permissionResult.granted === false) {
            Alert.alert('Permiso denegado', 'Necesitas dar permiso para usar la cámara');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSaveUrl = () => {
        if (tempUrl.trim()) {
            setImage(tempUrl.trim());
            setTempUrl('');
            setShowUrlModal(false);
        } else {
            Alert.alert('Error', 'Por favor ingresa una URL válida');
        }
    };

    const handleImageOptions = () => {
        Alert.alert(
            'Seleccionar imagen',
            'Elige una opción',
            [
                {
                    text: 'Galería',
                    onPress: pickImage,
                },
                {
                    text: 'Cámara',
                    onPress: takePhoto,
                },
                {
                    text: 'URL',
                    onPress: () => setShowUrlModal(true),
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ]
        );
    };

    const handleTimeChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setTime(time + 5);
        } else if (type === 'decrease' && time > 5) {
            setTime(time - 5);
        }
    };

    const validateForm = (): boolean => {
        const newErrors = {
            name: name.trim() === '',
            ingredients: ingredients.trim() === '',
            instructions: instructions.trim() === '',
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.ingredients || newErrors.instructions) {
            Alert.alert(
                'Campos requeridos',
                'Por favor completa todos los campos obligatorios',
                [{ text: 'OK' }]
            );
            return false;
        }

        return true;
    };

    // 🔥 Actualizar en lugar de agregar
    const handleUpdateRecipe = () => {
        if (!validateForm()) {
            return;
        }

        const recipeId = Number(id);

        const ingredientsArray = ingredients
            .split('\n')
            .map(i => i.trim())
            .filter(i => i !== '');

        const instructionsArray = instructions
            .split('\n')
            .map(i => i.trim())
            .filter(i => i !== '');

        updateRecipe(recipeId, {
            name: name.trim(),
            image: image || 'https://via.placeholder.com/300x200',
            level,
            time,
            ingredients: ingredientsArray,
            instructions: instructionsArray,
        });

        Alert.alert(
            'Éxito',
            'Receta actualizada correctamente',
            [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#131b23] pt-5">
            <View className="flex-row items-center px-4 py-3 border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-2">Edit Recipe</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {/* Nombre */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white text-sm font-semibold">Recipe name</Text>
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
                        placeholder="e.g. Spaghetti Carbonara"
                        placeholderTextColor="#6b7280"
                        className={`bg-gray-800 text-white px-4 py-3 rounded-lg ${
                            errors.name ? 'border-2 border-red-500' : ''
                        }`}
                    />
                    {errors.name && (
                        <Text className="text-red-500 text-xs mt-1">Este campo es requerido</Text>
                    )}
                </View>

                {/* Selector de Imagen */}
                <View className="mb-6">
                    <Text className="text-white text-sm mb-2 font-semibold">Recipe image</Text>
                    
                    {image ? (
                        <View className="relative">
                            <Image
                                source={{ uri: image }}
                                className="w-full h-48 rounded-lg"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                onPress={handleImageOptions}
                                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
                            >
                                <Feather name="edit-2" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleImageOptions}
                            className="bg-gray-800 h-48 rounded-lg items-center justify-center border-2 border-dashed border-gray-600"
                        >
                            <Feather name="image" size={48} color="#6b7280" />
                            <Text className="text-gray-400 mt-2">Tap to add image</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Nivel */}
                <View className="mb-6">
                    <Text className="text-white text-sm mb-2 font-semibold">Difficulty</Text>
                    <View className="flex-row gap-2">
                        {levels.map((lv) => (
                            <TouchableOpacity
                                key={lv}
                                onPress={() => setLevel(lv)}
                                className={`flex-1 px-4 py-3 rounded-lg ${
                                    level === lv ? 'bg-[#00ff9d]' : 'bg-gray-800'
                                }`}
                            >
                                <Text className={`text-center ${
                                    level === lv ? 'text-black font-semibold' : 'text-white'
                                }`}>
                                    {lv}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Tiempo */}
                <View className="mb-6">
                    <Text className="text-white text-sm mb-2 font-semibold">Cooking time (minutes)</Text>
                    <View className="flex-row items-center bg-gray-800 rounded-lg p-2">
                        <TouchableOpacity
                            onPress={() => handleTimeChange('decrease')}
                            className="bg-gray-700 w-10 h-10 rounded-lg items-center justify-center"
                        >
                            <Text className="text-white text-xl">-</Text>
                        </TouchableOpacity>

                        <Text className="flex-1 text-center text-white text-xl font-semibold">
                            {time} min
                        </Text>

                        <TouchableOpacity
                            onPress={() => handleTimeChange('increase')}
                            className="bg-[#00ff9d] w-10 h-10 rounded-lg items-center justify-center"
                        >
                            <Text className="text-black text-xl">+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Ingredientes */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white text-sm font-semibold">Ingredients</Text>
                        <Text className="text-red-500 ml-1">*</Text>
                    </View>
                    <Text className="text-gray-400 text-xs mb-2">One per line</Text>
                    <TextInput
                        value={ingredients}
                        onChangeText={(text) => {
                            setIngredients(text);
                            if (errors.ingredients && text.trim() !== '') {
                                setErrors({ ...errors, ingredients: false });
                            }
                        }}
                        placeholder="Eggs&#10;Milk&#10;Cheese"
                        placeholderTextColor="#6b7280"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        className={`bg-gray-800 text-white px-4 py-3 rounded-lg ${
                            errors.ingredients ? 'border-2 border-red-500' : ''
                        }`}
                    />
                    {errors.ingredients && (
                        <Text className="text-red-500 text-xs mt-1">Este campo es requerido</Text>
                    )}
                </View>

                {/* Instrucciones */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-white text-sm font-semibold">Instructions</Text>
                        <Text className="text-red-500 ml-1">*</Text>
                    </View>
                    <Text className="text-gray-400 text-xs mb-2">One step per line</Text>
                    <TextInput
                        value={instructions}
                        onChangeText={(text) => {
                            setInstructions(text);
                            if (errors.instructions && text.trim() !== '') {
                                setErrors({ ...errors, instructions: false });
                            }
                        }}
                        placeholder="Beat the eggs&#10;Heat the pan&#10;Cook for 5 minutes"
                        placeholderTextColor="#6b7280"
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                        className={`bg-gray-800 text-white px-4 py-3 rounded-lg ${
                            errors.instructions ? 'border-2 border-red-500' : ''
                        }`}
                    />
                    {errors.instructions && (
                        <Text className="text-red-500 text-xs mt-1">Este campo es requerido</Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleUpdateRecipe}
                    className="bg-[#00ff9d] py-4 rounded-lg items-center mb-8"
                >
                    <Text className="text-black text-lg font-bold">Update recipe</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal para ingresar URL */}
            <Modal
                visible={showUrlModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowUrlModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                    <View className="bg-gray-800 w-full rounded-lg p-6">
                        <Text className="text-white text-lg font-bold mb-4">Enter Image URL</Text>
                        
                        <TextInput
                            value={tempUrl}
                            onChangeText={setTempUrl}
                            placeholder="https://example.com/image.jpg"
                            placeholderTextColor="#6b7280"
                            className="bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                        />

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => {
                                    setTempUrl('');
                                    setShowUrlModal(false);
                                }}
                                className="flex-1 bg-gray-700 py-3 rounded-lg"
                            >
                                <Text className="text-white text-center font-semibold">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSaveUrl}
                                className="flex-1 bg-[#00ff9d] py-3 rounded-lg"
                            >
                                <Text className="text-black text-center font-semibold">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
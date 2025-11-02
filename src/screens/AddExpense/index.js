import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {addDoc, collection, query, where, getDocs} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';
import styles from './styles';

const AddExpenseScreen = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategories = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', user.uid),
        );
        const querySnapshot = await getDocs(q);
        const categoryData = [];
        querySnapshot.forEach(doc => {
          categoryData.push(doc.data().name);
        });
        setCategories(categoryData);
        if (categoryData.length > 0 && !category) {
          setCategory('');
        }
      }
    } catch (error) {
      console.error('Kategoriler alınırken hata:', error);
    }
  };

  const handleAddExpense = async () => {
    if (!amount || !category) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'expenses'), {
          userId: user.uid,
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(),
        });
        Alert.alert('Başarılı', 'Harcama eklendi!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Hata', 'Harcama eklenirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Harcama Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Miktar (TL)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Kategori:</Text>
        <RNPickerSelect
          placeholder={{label: 'Kategori seçin...', value: null}}
          items={categories.map(cat => ({label: cat, value: cat}))}
          onValueChange={value => setCategory(value)}
          value={category}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Açıklama (İsteğe bağlı)"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddExpenseScreen;

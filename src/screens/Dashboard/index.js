import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db, auth, signOut} from '../../config/firebase';
import styles from './styles';

const DashboardScreen = ({navigation}) => {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchExpenses();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchExpenses = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'expenses'),
          where('userId', '==', user.uid),
        );
        const querySnapshot = await getDocs(q);
        const expenseData = [];
        let total = 0;
        querySnapshot.forEach(doc => {
          const data = doc.data();
          expenseData.push({...data, id: doc.id});
          total += data.amount;
        });
        setExpenses(expenseData);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error('Harcamalar alınırken hata:', error);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartData = expenses.reduce((acc, expense) => {
    const category = acc.find(item => item.name === expense.category);
    if (category) {
      category.amount += expense.amount;
    } else {
      acc.push({
        name: expense.category,
        amount: expense.amount,
        color: getRandomColor(),
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      });
    }
    return acc;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Harcama Takip</Text>
      <View style={styles.summary}>
        <Text style={styles.totalText}>
          Toplam Harcama: {totalAmount.toFixed(2)} TL
        </Text>
      </View>
      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
          {chartData.map((item, index) => (
            <View key={index} style={styles.chartItem}>
              <View style={[styles.colorBox, {backgroundColor: item.color}]} />
              <Text style={styles.chartText}>
                {item.name}: {item.amount.toFixed(2)} TL
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddExpense')}>
          <Text style={[styles.buttonText, {fontSize: 20}]}>➕</Text>
          <Text style={styles.buttonText}>Harcama Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ExpenseList')}>
          <Text style={[styles.buttonText, {fontSize: 20}]}>📋</Text>
          <Text style={styles.buttonText}>Harcama Listesi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Advice')}>
          <Text style={[styles.buttonText, {fontSize: 20}]}>💡</Text>
          <Text style={styles.buttonText}>Tavsiye Al</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#dc3545'}]}
          onPress={handleLogout}>
          <Text style={[styles.buttonText, {fontSize: 20}]}>🚪</Text>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

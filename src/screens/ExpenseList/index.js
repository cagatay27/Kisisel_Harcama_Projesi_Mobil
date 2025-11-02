import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';
import styles from './styles';

const ExpenseListScreen = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

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
        querySnapshot.forEach(doc => {
          expenseData.push({...doc.data(), id: doc.id});
        });
        setExpenses(expenseData);
      }
    } catch (error) {
      console.error('Harcamalar alınırken hata:', error);
    }
  };

  const handleDeleteExpense = async id => {
    Alert.alert(
      'Silme Onayı',
      'Bu harcamayı silmek istediğinizden emin misiniz?',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'expenses', id));
              setExpenses(expenses.filter(expense => expense.id !== id));
            } catch (error) {
              Alert.alert('Hata', 'Harcama silinirken bir hata oluştu.');
            }
          },
        },
      ],
    );
  };

  const renderExpense = ({item}) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.amount}>{item.amount} TL</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.date.seconds * 1000).toLocaleDateString('tr-TR')}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
        <Text style={{fontSize: 20, color: '#dc3545'}}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Harcama Listesi</Text>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz harcama eklenmemiş.</Text>
        }
      />
    </View>
  );
};

export default ExpenseListScreen;

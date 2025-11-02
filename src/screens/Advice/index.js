import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';
import {getExpenseAdvice} from '../../services/geminiService';
import styles from './styles';

const AdviceScreen = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'expenses'),
          where('userId', '==', user.uid),
        );
        const querySnapshot = await getDocs(q);
        const expenses = [];
        querySnapshot.forEach(doc => {
          expenses.push(doc.data());
        });
        const adviceText = await getExpenseAdvice(expenses);
        setAdvice(adviceText);
      }
    } catch (error) {
      setAdvice('Tavsiye alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Finansal Tavsiyeler</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={fetchAdvice}>
        <Text style={styles.buttonText}>Yeni Tavsiye Al</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdviceScreen;

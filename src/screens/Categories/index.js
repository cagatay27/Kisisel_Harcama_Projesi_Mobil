import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';
import styles from './styles';

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

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
          categoryData.push({...doc.data(), id: doc.id});
        });
        setCategories(categoryData);
      }
    } catch (error) {
      console.error('Kategoriler alınırken hata:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Hata', 'Kategori adı boş olamaz.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'categories'), {
          userId: user.uid,
          name: newCategory.trim(),
        });
        setNewCategory('');
        fetchCategories();
      }
    } catch (error) {
      Alert.alert('Hata', 'Kategori eklenirken bir hata oluştu.');
    }
  };

  const handleEditCategory = category => {
    setEditingCategory(category.id);
    setEditingText(category.name);
  };

  const handleSaveEdit = async () => {
    if (!editingText.trim()) {
      Alert.alert('Hata', 'Kategori adı boş olamaz.');
      return;
    }

    try {
      await updateDoc(doc(db, 'categories', editingCategory), {
        name: editingText.trim(),
      });
      setEditingCategory(null);
      setEditingText('');
      fetchCategories();
    } catch (error) {
      Alert.alert('Hata', 'Kategori güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteCategory = async id => {
    Alert.alert(
      'Silme Onayı',
      'Bu kategoriyi silmek istediğinizden emin misiniz?',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'categories', id));
              setCategories(categories.filter(cat => cat.id !== id));
            } catch (error) {
              Alert.alert('Hata', 'Kategori silinirken bir hata oluştu.');
            }
          },
        },
      ],
    );
  };

  const renderCategory = ({item}) => (
    <View style={styles.categoryItem}>
      {editingCategory === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editingText}
            onChangeText={setEditingText}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleEditCategory(item)}>
              <Text style={{fontSize: 20, color: '#007bff'}}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteCategory(item.id)}>
              <Text style={{fontSize: 20, color: '#dc3545'}}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategoriler</Text>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni kategori adı"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={{fontSize: 20, color: '#fff'}}>➕</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz kategori eklenmemiş.</Text>
        }
      />
    </View>
  );
};

export default CategoriesScreen;

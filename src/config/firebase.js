import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  // Firebase konfigürasyonunuzu buraya ekleyin
  // Firebase Console'dan alınacak
  apiKey: 'AIzaSyB0DFXqynP7aBadraCTB01Ba_BzIFIEM80',
  authDomain: 'kisiselharcama-a45b0.firebaseapp.com',
  projectId: 'kisiselharcama-a45b0',
  storageBucket: 'kisiselharcama-a45b0.firebasestorage.app',
  messagingSenderId: '734337857248',
  appId: '1:734337857248:web:faf61dfa20efaa4cc20285',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

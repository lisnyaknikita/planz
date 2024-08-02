import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyAuNeXXr3jEO6MJddG4g4uV44qed825F2g',
	authDomain: 'planz-35e0e.firebaseapp.com',
	projectId: 'planz-35e0e',
	storageBucket: 'planz-35e0e.appspot.com',
	messagingSenderId: '632942195127',
	appId: '1:632942195127:web:731f0675f4e972778ab832',
	measurementId: 'G-XJ3E8F7D3D',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }

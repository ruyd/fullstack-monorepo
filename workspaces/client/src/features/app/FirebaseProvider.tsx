import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDoBAZHetVo7nx5iKkfIHD6JFZf6pZ229w',
  authDomain: 'drawspace-6c652.firebaseapp.com',
  projectId: 'drawspace-6c652',
  storageBucket: 'drawspace-6c652.appspot.com',
  messagingSenderId: '713284092696',
  appId: '1:713284092696:web:d0433bf5a53abd90fed46d',
  measurementId: 'G-DB561ZZ8PB',
}

initializeApp(firebaseConfig)

export default function FirebaseProvider() {
  return <></>
}

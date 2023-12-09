import { collection, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase/configFirebase';
export default function UseRooms(){

    const [snapShot] = useCollection(query(collection(db, "rooms"), orderBy('timestamp', 'asc')));
    const rooms = snapShot?.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    
    return rooms
    
}
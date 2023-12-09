import { collection, orderBy, query } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from "../../firebase/configFirebase"

export default function useChatMessage(roomId){
  const [snapShot] = useCollection(roomId ? query(collection(db, `rooms/${roomId}/messages`), orderBy('timestamp', 'asc')) : null);
  const messages = snapShot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  return messages;
}
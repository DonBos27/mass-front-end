import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/configFirebase";

export default function useRoom(roomId, userId){
    const isUserRoom = roomId && roomId.includes(userId); // Check if roomId is not null
    const collectionId = isUserRoom ? "users" : "rooms";
    const docId = isUserRoom ? roomId.replace(userId, "") : roomId;
    const [snapShot] = useDocument(docId ? doc(db, `${collectionId}/${docId}`) : null);

    if (!snapShot?.exists()) return null;
    return {
    id: snapShot.id,
    photoUrl: snapShot.photoUrl || `https://avatars.dicebear.com/api/jdenticon/${snapShot.id}.svg`,
    ...snapShot.data(),
    };


}
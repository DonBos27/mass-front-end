import { collection, doc, orderBy, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase/configFirebase";

export default function useUsers(user){
    
    const [snapShot] = useCollection(
        query(collection(db,"users"), orderBy("timestamp", "desc"))
    );

    const users = []
        //console.log(user.email)
    snapShot?.docs.forEach((doc) => {
        const id = doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;
        if(doc.id !== user.uid){
            users.push({ id, ...doc.data() });
        }
        
    });
    
    return users;
}
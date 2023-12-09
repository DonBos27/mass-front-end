
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../firebase/configFirebase"
import { useEffect } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default function useAuthUser(){
    const [user] = useAuthState(auth);
    useEffect(() => {
        if(user){
            const userRef = doc(db, `users/${user.uid}`)
            getDoc(userRef).then(snapshot => {
                if(!snapshot.exists()){
                    setDoc(snapshot.ref, {
                        email: user.email,
                        photoURL: user.photoURL,
                        name: user.displayName,
                        timestamp: serverTimestamp()
                    
                    })
                }
            })

        }
    }, [user]);
    return user
}
import React, { useState } from 'react'
import useAuthUser from '../../../student/utils/useAuthUser'
import { useAuth } from '../../../context/AuthContext'
import { collection, query, where } from '@firebase/firestore'
import { db } from '../../../firebase/configFirebase'
import { useCollection } from 'react-firebase-hooks/firestore'

function StateGender() {
    const { user }  = useAuth()
    const users = useAuthUser(user)
    // retrieve male lenght
   
   
    // get all students in the database
    // const femaleQueryCondition = query(collection(db, "users"), where("gender", "==", "female"))
    // const [femaleSnapShot] = useCollection(femaleQueryCondition)
    // const femalesStudents = femaleSnapShot?.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    // }))

//     const maleQueryCondition = query(collection(db, "users"), where("gender", "==", "male"))
//     const [maleSnapShot] = useCollection(maleQueryCondition)
//     const maleStudents = maleSnapShot?.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }))
//     const maleStudentsCount = maleStudents.length
//     console.log("Female: ", maleStudentsCount)
//   return maleStudents
// const femaleQueryCondition = query(
//     collection(db, "users"),
//     where("gender", "==", "female")
//   );
//   const [femaleSnapShot, isloading, errors] = useCollection(femaleQueryCondition);
//   console.log('error',errors,'is loading ',isloading )
//     if (errors) {
//         console.log({errors})
//     }
//     if (isloading) {
//         console.log({isloading})
//     }
//     if (errors) {
//         console.log({errors});
//         return -1; // Handle the error as needed
//         }
//         if(!femaleSnapShot){
//             return 0 
//         }

  



const maleQueryCondition = query(
    collection(db, "users"),
    where("gender", "==", "male")
  );
  const [maleSnapShot, loading, error] = useCollection(maleQueryCondition);

  if (error) {
    console.error("Error fetching male students:", error);
    return -1; // Handle the error as needed
  }

  if (loading) {
    // Data is still loading, you can return a loading indicator or null
    return null;
  }

  if (!maleSnapShot) {
    console.error("No data for male students.");
    return 0; // Handle the case when no data is available
  }

  const maleStudentCount = maleSnapShot.size;
  
  
  
  return maleStudentCount;
}

export default StateGender

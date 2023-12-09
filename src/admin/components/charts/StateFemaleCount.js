import React, { useState } from 'react'
import useAuthUser from '../../../student/utils/useAuthUser'
import { useAuth } from '../../../context/AuthContext'
import { collection, query, where } from '@firebase/firestore'
import { db } from '../../../firebase/configFirebase'
import { useCollection } from 'react-firebase-hooks/firestore'

function StateFemaleCount() {
    const femaleQueryCondition = query(
        collection(db, "users"),
        where("gender", "==", "female")
      );
      const [femaleSnapShot, loading, error] = useCollection(femaleQueryCondition);
    
      if (error) {
        console.error("Error fetching male students:", error);
        return -1; // Handle the error as needed
      }
    
      if (loading) {
        // Data is still loading, you can return a loading indicator or null
        return null;
      }
    
      if (!femaleSnapShot) {
        console.error("No data for male students.");
        return 0; // Handle the case when no data is available
      }
    
      const femaleStudentCount = femaleSnapShot.size;
      
      
      
      return femaleStudentCount;
}

export default StateFemaleCount

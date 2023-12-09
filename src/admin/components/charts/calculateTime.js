import { db } from "../../../firebase/configFirebase";
import { doc, getDoc } from "firebase/firestore";

export const calculateTimeSpent = async (currentUser) => {
    const userDocRef = doc(db, "users", currentUser);

    try {
        const userSnapshot = await getDoc(userDocRef);
        // console.log(userSnapshot)
        const userData = userSnapshot.data();
        // console.log(userData)
        const timeIn = userData?.timeIn.toDate(); // get the time the user logged in
        const timeOut = userData?.timeOut.toDate();

        console.log("Time in:", timeIn)
        console.log("Time out:", timeOut)

        if (timeIn && timeOut) {
            // Calculate the time spent in milliseconds
            const timeSpentMillis = timeOut - timeIn;

            // Convert milliseconds to minutes
            const timeSpentMinutes = timeSpentMillis / (1000 * 60);

            // round to 2 decimal places and return the value in minutes 

            const roundedTimeSpentMinutes = Math.round(timeSpentMinutes * 100) / 100;

            // console.log("Time spent in minutes:", roundedTimeSpentMinutes)

            return roundedTimeSpentMinutes;
        }

        return 0; // Default value if timeIn or timeOut is missing
    } catch (error) {
        console.error("Error fetching user data:", error);
        return 0; // Default value on error
    }
};

export default calculateTimeSpent;


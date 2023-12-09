import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";

function Reports() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [lecturerId, setLecturerId] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserData(data);
        console.log(
          "lecturers ID:",
          data.map((item) => item.id)
        );
        const filteredLecturers = userData.filter((users) =>
          users.email.endsWith("@uj.ac.za") ? users.id : null
        );
        console.log("Filtered lecturers:", filteredLecturers);

        setLecturerId(filteredLecturers.map((item) => item.id));
        console.log("Lecturer ID:", lecturerId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

    // useEffect(() => {
    //   if (authUser) {
    //     const useruid = lecturerId;
    //     console.log("Email:", useruid);
    //     const unsubscribe = onSnapshot(
    //       doc(db, "calendarPost", useruid),
    //       (doc) => {
    //         if (doc.exists()) {
    //           const data = doc.data();
    //           console.log("Fetched data from Firestore:", data);
    //           const dataModules = data.lecturerPost;
    //           // console.log("Modules:", dataModules);
    //           const posts = dataModules.map((post) => ({
    //             ...post,
    //             start: post.start.toDate(),
    //             end: post.end.toDate(),
    //           }));

    //           // Convert dates to formatted strings
    //           const formattedPosts = posts.map((post) => ({
    //             ...post,
    //             formattedStartDate: post.start.toLocaleDateString("en-US", {
    //               weekday: "short",
    //               month: "short",
    //               day: "numeric",
    //             }),
    //             formattedEndDate: post.end.toLocaleDateString("en-US", {
    //               weekday: "short",
    //               month: "short",
    //               day: "numeric",
    //             }),
    //           }));

    //           setDatas(formattedPosts);
    //           console.log(formattedPosts);
    //           console.log(
    //             "Modules:",
    //             formattedPosts.map((item) => item.start)
    //           );
    //         }
    //       }
    //     );

    //     return () => {
    //       unsubscribe();
    //     };
    //   }
    // }, [authUser]);

  const logActivity = async (activity) => {
    // const today = new Date();
    // const logRef = collection(db, "logs", today.toISOString().split("T")[0]);
    // try {
    //   await addDoc(logRef, {
    //     timestamp: today,
    //     activity: activity,
    //   });
    //   console.log("Activity logged successfully");
    // } catch (error) {
    //   console.error("Error logging activity:", error);
    // }
  };

  // Example: Log an activity when the component mounts
  useEffect(() => {
    logActivity("User performed an action.");
  }, []);

  return <div>Reports</div>;
}

export default Reports;

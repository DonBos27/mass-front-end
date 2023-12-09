import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
} from "@material-tailwind/react";
import Profile from "../images/profileicon.png";
import UJLogo from "../images/uj.png";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
// import calculateTimeSpent from "./charts/calculateTime";

function WelcomeCard() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserData(data);
      console.log("User Data:", data);
      const filteredAdmin = data.filter((user) =>
        user.email.endsWith("@admin.uj.ac.za")
      );
      console.log("Filtered Lecturers:", filteredAdmin);
      setAdminData(filteredAdmin);
    });

    // console.log("User Data:", userData);

    return () => {
      unsubscribe();
    };
  }, [setUserData]);

  useEffect(() => {
    console.log("Admin Data:", adminData);
  }, [adminData]);

  // useEffect(() => {
  //   if (authUser) {
  //     const email = authUser.email;
  //     console.log("Email:", email);
  //     const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
  //       const data = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setUserData(data);
  //     });
  //     const filteredAdmin = userData.filter((user) =>
  //       user.email.endsWith("@admin.uj.ac.za")
  //     );
  //     // console.log("Filtered Lecturers:", filteredAdmin);
  //     setAdminData(filteredAdmin);
  //     console.log("Admin Data:", adminData);
  //     console.log(adminData.map((admin) => admin.name));
  //     console.log("User Data:", userData);
  //     return () => {
  //       unsubscribe();
  //     };
  //   }
  // }, [authUser]);
  return (
    <div>
      {adminData &&
        adminData.map((admin) => (
          <Card
            shadow={false}
            className="w-full mt-0 overflow-hidden text-center"
            key={admin.id}
          >
            <CardHeader
              floated={false}
              shadow={false}
              className="relative h-56 bg-[url('https://www.uj.ac.za/wp-content/uploads/2021/11/university-of-johannesburg.webp')] bg-cover bg-center"
            >
              <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
              <Avatar
                size="xxl"
                alt="avatar"
                src={admin.photoURL ? admin.photoURL : Profile}
                className="border shadow-xl shadow-green-900/20 mt-10 mx-auto "
              />
            </CardHeader>
            <CardBody className="text-center border-b border-black/20 pb-4 mx-8 my-2 rounded-none">
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {admin.name}
              </Typography>
              <Typography
                color="blue-gray"
                className="font-medium"
                textGradient
              >
                {admin.role}
              </Typography>
            </CardBody>
            <CardFooter className=" justify-center">
              <Typography color="blue-gray" className="font-medium my-2">
                {admin.department}
              </Typography>
              <Tooltip  
                placement="top"
                content="University of Johannesburg"
              >
                <Avatar
                  size="lg"
                  className="mx-1"
                  src={UJLogo}
                  alt="UJ Logo"
                />
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}

export default WelcomeCard;

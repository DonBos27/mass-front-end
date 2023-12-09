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
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";

export default function ProfileCard() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  // const [lecturerId, setLecturerId] = useState(null);

  useEffect(() => {
    if (authUser) {
      const uid = authUser.uid;
      console.log("Email:", uid);
      const unsubscribe = onSnapshot(doc(db, "users", uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Fetched data from Firestore:", data);
          setUserData(data);
          // setLecturerId(data.name);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);
  return (
    <Card
      shadow={false}
      className="w-96 mt-0 justify-center overflow-hidden text-center"
    >
      <CardHeader
        floated={false}
        shadow={false}
        // color="transparent"
        className="relative h-56 bg-[url('https://www.uj.ac.za/wp-content/uploads/2021/11/university-of-johannesburg.webp')] bg-cover bg-center"
      >
        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
        <Avatar
          size="xxl"
          alt="avatar"
          src={userData.photoURL ? userData.photoURL : Profile}
          className="border shadow-xl shadow-green-900/20 mt-10 mx-auto "
        />
      </CardHeader>

      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {userData.title} {userData.firstname} {userData.name}
        </Typography>
        <Typography color="gray" className="font-medium" key={authUser.uid}>
          {userData.function}
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center">
        <Tooltip
          placement="top"
          // color="lightBlue"
          content="University of Johannesburg"
        >
          <Avatar
            // color="lightBlue"
            size="lg"
            className="mx-1"
            src={UJLogo}
            alt="UJ Logo"
          />
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import CalendarPost from "./CalendarPost";
import SpinnerLoading from "./SpinnerLoading";

function ModulesLecturer() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [lecturerId, setLecturerId] = useState(null);
  const [size, setSize] = React.useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const email = authUser.email;
      console.log("Email:", email);
      const unsubscribe = onSnapshot(
        doc(db, "users", authUser.uid), // Assuming your collection is "users" and the document ID is the email
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            console.log("Fetched data from Firestore:", data);
            const dataModules = data.modules;
            console.log("Modules:", dataModules);
            setTimeout(() => {
              setUserData(dataModules);
              setLecturerId(data.id);
              setIsLoading(false);
            }, 2000);
            // console.log("Lecturer ID:", lecturerId);
            console.log(
              "Modules:",
              data.modules.map((item) => item.moduleCode)
            );
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);

  const handleOpen = (value) => {
    setSize(value);
    console.log("Open Calendar");
  };

  return (
    <div className="flex flex-row gap-3">
      {isLoading ? (
        <SpinnerLoading />
      ) : userData && userData.length ?  (
        userData &&
        userData.map((item, index) => (
          <div key={index}>
            <Typography className="text-4xl font-bold py-5">Modules</Typography>
            <Card className="w-96 " key={item.moduleCode}>
              <CardHeader shadow={false} floated={false} className="h-96">
                <img
                  src={item.moduleImage}
                  alt="card-image"
                  className="h-full w-full object-cover"
                />
              </CardHeader>
              <CardBody>
                <div className="mb-2 flex items-center justify-between">
                  <Typography color="blue-gray" className="font-medium">
                    {item.moduleName}
                  </Typography>
                  <Typography color="blue-gray" className="font-medium">
                    {item.moduleCode}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  onClick={() => handleOpen("lg")}
                  ripple={false}
                  fullWidth={true}
                  className="bg-primary text-white shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                >
                  Open Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <div className="flex flex-col ">
          <Typography className="text-2xl font-bold px-5">No Modules Assigned </Typography>
          <Typography className="text-lg font-normal px-5">
            Please check back later
          </Typography>
        </div>
      )}
      <Dialog open={size === "lg"} size={size || "lg"} handler={handleOpen}>
        <DialogHeader>Add Test, Assignment, Labs</DialogHeader>
        <DialogBody divider className="m-5">
          <CalendarPost />
        </DialogBody>
      </Dialog>
    </div>
  );
}

export default ModulesLecturer;

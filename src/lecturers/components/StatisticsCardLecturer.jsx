import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import { collection, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";

function StatisticsCardLecturer() {
  const [userData, setUserData] = useState([]);
  const { user } = useAuth();
  const [numbersOfStudents, setNumbersOfStudents] = useState();
  const [modulesCodeLength, setModulesCodeLength] = useState(0);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserData(data);

        const filteredLecturers = data.filter((users) =>
          user.email.endsWith("@uj.ac.za") ? users.id === user.uid : null
        );
        console.log("Filtered lecturers:", filteredLecturers);

        const modulesTaken = filteredLecturers.flatMap(
          (user) => user.modules || []
        );
        console.log("Modules taken:", modulesTaken);

        const modulesCodeTaken = modulesTaken.flatMap((module) => {
          if (Array.isArray(module)) {
            return module.map((item) => item.code);
          } else if (typeof module === "object") {
            return [module.moduleCode];
          } else {
            console.error(
              "Unexpected data type for 'module':",
              typeof module,
              module
            );
            return [];
          }
        });
        console.log("Modules codes taken:", modulesCodeTaken);

        const targetUserStudent = data
          .filter((user) => user.email.endsWith("@student.uj.ac.za"))
          .map((student) => ({
            id: student.id,
            modules: student.enrolled_modules,
          }));
        console.log("Target user student:", targetUserStudent);

        const enrolledModulesData = [];
        if (Array.isArray(targetUserStudent)) {
          console.log("targetUserStudent is an array:", targetUserStudent);

          for (const userRefObject of targetUserStudent) {
            try {
              if (Array.isArray(userRefObject.modules)) {
                console.log("Current userRefObject:", userRefObject);

                for (const moduleRef of userRefObject.modules) {
                  try {
                    const moduleDoc = await getDoc(moduleRef);
                    if (moduleDoc.exists()) {
                      enrolledModulesData.push({
                        id: moduleDoc.id,
                        ...moduleDoc.data(),
                      });
                    } else {
                      console.log("Module not found:", moduleRef.id);
                    }
                  } catch (error) {
                    console.error("Error fetching module data:", error);
                  }
                }
              } else {
                console.log("modules is not an array:", userRefObject.id);
              }
            } catch (error) {
              console.error("Error processing userRefObject:", error);
            }
          }
        } else {
          console.log("targetUserStudent is not an array:", targetUserStudent);
        }

        console.log("Enrolled Modules Data:", enrolledModulesData);
        const modules = enrolledModulesData.map((module) => module.moduleCode);
        const modulesCode = modules.filter((module) =>
          modulesCodeTaken.includes(module)
        );
        const newModulesCodeLength = modulesCode.length;
        console.log("Modules:", modules);
        console.log("Modules code:", modulesCode);
        console.log("Modules code length:", newModulesCodeLength);
        setNumbersOfStudents(newModulesCodeLength);
        setModulesCodeLength(newModulesCodeLength);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredLecturers = userData.filter((users) =>
    user.email.endsWith("@uj.ac.za") ? users.id === user.uid : null
  );
  console.log("Filtered lecturers:", filteredLecturers);
  // Use flatMap to flatten the array of arrays
  const modulesTaken = filteredLecturers.flatMap((user) => user.modules || []);

  console.log("Modules taken:", modulesTaken);

  // Use flatMap again to flatten the array of codes
  const modulesCodeTaken = modulesTaken.flatMap((module) => {
    if (Array.isArray(module)) {
      // If module is an array, map over it to get codes
      return module.map((item) => item.code);
    } else if (typeof module === "object") {
      // If module is an object, process it differently (here, returning an array with a single code)
      return [module.moduleCode];
    } else {
      console.error(
        "Unexpected data type for 'module':",
        typeof module,
        module
      );
      return []; // or handle it appropriately based on your use case
    }
  });

  console.log("Modules codes taken:", modulesCodeTaken);

  const modulesTakenLength = modulesTaken.length;

  // users who has enrolled modules and are students (not lecturers) the field is an array with 2 document references to modules collection (modules/moduleCode)
  // How to get the length of array of document references where moduleCode is the same as modulesCodeTaken

  const targetUserStudent = userData
    .filter((user) => user.email.endsWith("@student.uj.ac.za"))
    .map((student) => ({
      id: student.id,
      modules: student.enrolled_modules,
    }));

  const data = [
    {
      id: 1,
      icon: <LibraryBooksIcon />,
      title: "Modules Taken",
      amount: modulesTakenLength,
      color: "blue",
    },
    {
      id: 2,
      icon: <PeopleIcon />,
      title: "Numbers of Students",
      amount: modulesCodeLength,
      color: "deep-orange",
    },
  ];
  return (
    <div className="my-12 grid gap-y-10 gap-x-5 md:grid-cols-1 xl:grid-cols-2">
      {data.map((item) => (
        <Card className="" key={item.id}>
          <CardHeader
            variant="gradient"
            color={item.color}
            className="absolute -mt-4 grid h-16 w-16 place-items-center "
          >
            {item.icon}
          </CardHeader>
          <CardBody className="p-4 text-right">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-600"
            >
              {item.title}
            </Typography>
            <Typography variant="h4" color="blue-gray">
              {item.amount}
            </Typography>
          </CardBody>
          {/* <CardFooter className="border-t border-blue-gray-50 p-4"></CardFooter> */}
        </Card>
      ))}
    </div>
  );
}

export default StatisticsCardLecturer;

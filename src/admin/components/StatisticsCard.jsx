import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PersonIcon from "@mui/icons-material/Person";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";

function StatisticsCard() {
  const [userData, setUserData] = useState([]);
  const [lecturerLength, setLecturerLenght] = useState();
  const [undergraduate, setUndergraduate] = useState();
  const [postgraduate, setPostgraduate] = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserData(data);
      console.log("User Data:", data);
      const filteredLecturer = data.filter((user) =>
        user.email.endsWith("@uj.ac.za")
      );
      const filteredStudent = data.filter((user) =>
        user.email.endsWith("@student.uj.ac.za")
      );
      // check where filteredstudent has a level field that is equal to undergrad or postgrad and then filter it 
      const filteredUndergrad = filteredStudent.filter((user) => user.level === "undergraduate");
      const filteredPostgrad = filteredStudent.filter((user) => user.level === "postgraduate");
      const filterredStudentLenghtUnder = filteredUndergrad.length;
      const filterredStudentLenghtPost = filteredPostgrad.length;
      const filterredLecturerLenght = filteredLecturer.length;
      setUndergraduate(filterredStudentLenghtUnder);
      setPostgraduate(filterredStudentLenghtPost);
      setLecturerLenght(filterredLecturerLenght);
    });
    return () => {
      unsubscribe();
    };
  }, [setUserData]);


  const data = [
    {
      id: 1,
      icon: <PersonIcon />,
      title: "Total Lecturers",
      amount: lecturerLength,
      color: "blue",
    },
    {
      id: 2,
      icon: <PersonIcon />,
      title: "Undergraduates Students",
      amount: undergraduate,
      color: "deep-orange",
    },
    {
      id: 3,
      icon: <PersonIcon />,
      title: "Postgraduates Students",
      amount: postgraduate,
      color: "deep-purple",
    },
  ];
  return (
    <div className="mb-12 grid gap-y-10 gap-x-5 md:grid-cols-2 xl:grid-cols-3">
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

export default StatisticsCard;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import Background from "./images/background.gif";
import { useAuth } from "../context/AuthContext";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { auth, db, usersCollection } from "../firebase/configFirebase";
import useAuthUser from "../student/utils/useAuthUser";
import { signInWithEmailAndPassword } from "@firebase/auth";
// import { Alert } from "react-native-web";

function Login() {
  // story months into an array
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // getting the current the date
  const current = new Date();
  // Displaying the day and the month
  const date = `${current.getDate()} ${month[current.getMonth()]}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const { user, logIn, logOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Login");
    console.log();
    handleLogout();
    // handleLogin();
  }, []);

  const clearFields = () => {
    setEmail("");
    setPassword("");
  };
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email === "" || password === "") {
        console.log("Please enter your credentials");
        setError("Please enter a username and or password");
        setErrorAlert(true);
        // setTimeout(() => {
        //   setErrorAlert(false); // Automatically dismiss error alert after 2 seconds
        // }, 2000);
        return;
      }
      await logIn(email, password);
      // Log the timeIn when the user logs in
      if (email.endsWith("@admin.uj.ac.za")) {
        navigate("/dashboard");
      } else if (email.endsWith("@uj.ac.za")) {
        navigate("/homelecturer");
      } else if (email.endsWith("@student.uj.ac.za")) {
        navigate("/modules");
      }
      console.log("Login");
      // navigate("/dashboard");
      
    } catch (err) {
      setError(
        "You could not be authenticated, please check your username/password then try again."
      );
      setErrorAlert(true);
      console.log(err);
      // setEmail("");
      setPassword("");
      // setTimeout(() => {
      //   setErrorAlert(false); // Automatically dismiss error alert after 2 seconds
      // }, 2000);
    }
  };

  const handleLogout = async () => {
    try {
      // await logOut();
      if (user) {
        const userDocRef = doc(db, "users", user.email);
        console.log(userDocRef);
        await updateDoc(userDocRef, {
          timeIn: Timestamp.fromDate(new Date()),
        });
        
      }
      console.log("Logout");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <img
        src={Background}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader className="mb-4 flex justify-around h-28 place-items-center bg-[#2E1A46]">
            <Typography variant="h3" color="white">
              MASS
            </Typography>
            <Typography variant="h6" color="white">
              {date}
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Typography variant="small">
              Please enter your credentials:
            </Typography>
            <Input
              type="email"
              // color="deep-orange"
              label="Login ID"
              size="lg"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <Input
              type="password"
              // color="deep-orange"
              label="Password"
              size="lg"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            {errorAlert && <Typography color="red">{error}</Typography>}
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              fullWidth
              className="bg-secondary hover:bg-primary"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;

import React, { useEffect, useState } from "react";
import Sidebar from '../global/Sidebar'
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Avatar,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NavbarStudent from '../global/NavbarStudent';
import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import { useAuth } from "../../context/AuthContext";
import ProfileIm from "../images/profileicon.png"
import { Alert } from "@mui/material";


const TABLE_HEAD = ["Member", "Function", "Message", ""];
function BookingsStudent({handleProfile}) {

  const [lecturer, setLecture] = useState([]);
  const [bookingMessage, setBookingMessage] = useState('');
  const { user, logOut } = useAuth();
  const display = user.email;
  
  const handleBooking = async (lecturerId) => {
    if (bookingMessage.trim() !== '') {
      const bookingData = {
        lecturerId: lecturerId,
        message: bookingMessage,
        student: display,
      };

      try {
        const docRef = await addDoc(collection(db, 'bookings'), bookingData);
        //console.log('Booking created with ID:', docRef.id);

        // Clear the booking message after booking
        setBookingMessage('');
        alert("Your booking was sent successfully");
      } catch (error) {
        console.error('Error creating booking:', error);
      }
      } else {
        // return alert message
        alert("Please fill the box")
    }
    if (lecturerId) {
      //console.log(`Booked session with lecturer ID: ${lecturerId}`);
      //console.log(`Booking Message: ${bookingMessage}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const filteredUsers = data.filter((user) => user.id.endsWith("@uj.ac.za"));
      //console.log(filteredUsers);
      setLecture(filteredUsers);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
    
    return (
        <div className="flex">
        <div className="w-1/4">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full mr-4 mb-4 mt-4 h-full">
          <NavbarStudent Icon={LibraryBooksIcon} title={"Booking"} handleProfile={handleProfile} />
          <Card className='w-full mt-4'>
          <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="leading-none opacity-70 text-xl font-semibold"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lecturer.map(
                (item, index) => {
                  const isLast = index === lecturer.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
   
                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={item.image ? item.image: ProfileIm} alt={item.name} size="xl" className="" />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-lg"
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70 text-lg"
                            >
                              {item.id}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-lg"
                          >
                            {item.function}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70 text-lg"
                          >
                            Lecturer
                          </Typography>
                        </div>
                      </td>
                      {/* <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={online ? "online" : "offline"}
                            color={online ? "green" : "blue-gray"}
                          />
                        </div>
                      </td> */}
                      <td className={classes}>
                      <textarea 
                      className='w-[247px] h-[100px] bg-[#D9D9D9] p-3 resize-none rounded-lg text-lg'
                      placeholder='Message'
                      
                      onChange={(e) => setBookingMessage(e.target.value)} 
                      />
                      </td>
                      <td className={classes}>
                        <Tooltip content="Request">
                        <button 
                        className='bg-[#F26522] h-[37px] w-[150px] rounded-lg text-white text-lg cursor-pointer'
                        onClick={() => handleBooking(item.id)}
                        >Book</button>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
          </Card>
        </div>
      </div>
  )
}

export default BookingsStudent

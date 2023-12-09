import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react";
import { Editor } from "primereact/editor";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/configFirebase";
import UJLogo from "../images/uj.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
const radio = [
  { id: 1, value: "everyone", color: "blue" },
  { id: 2, value: "lecturer", color: "green" },
  { id: 3, value: "student", color: "red" },
];

function AnnouncementComponents() {
  const { user: authUser } = useAuth();
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (authUser) {
      const uid = authUser.uid;
      console.log("Email:", authUser.uid);
      const unsubscribe = onSnapshot(doc(db, "users", uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Fetched data from Firestore:", data);
          setName(data.name);
          console.log("Admin name:", name);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true); // Set isSubmitting to true when submission starts

    if (title === "" || text === "") {
      toast.error("Please fill in all the fields!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (!recipient) {
      toast.error("Please select a recipient!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsSubmitting(false);
      return;
    }
    console.log("Content:", text);

    try {
      const email = authUser.email;
      const userRole = email.endsWith("@uj.ac.za") ? "lecturer" : "student";

      let announcementsCollection;

      if (recipient === "everyone") {
        // Create announcements in both lecturer and student collections
        announcementsCollection = collection(db, `announcements_lecturer`);
        await addDoc(announcementsCollection, {
          title,
          text,
          recipient: recipient,
          timestamp: serverTimestamp(),
          name: name,
        });

        announcementsCollection = collection(db, `announcements_student`);
        await addDoc(announcementsCollection, {
          title,
          text,
          recipient: recipient,
          timestamp: serverTimestamp(),
          name: name,
        });
        console.log("Announcement created successfully for everyone!");
      } else {
        // Create announcement in the corresponding collection
        announcementsCollection = collection(db, `announcements_${recipient}`);
        await addDoc(announcementsCollection, {
          title,
          text,
          recipient,
          timestamp: serverTimestamp(),
          name: name,
        });
        console.log(`Announcement created successfully for ${recipient}!`);
      }
      // setText(text);
      toast("Announcement created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTitle("");
      setRecipient("");
      setText("");
    } catch (err) {
      console.log(err);
      alert("Failed to create announcement!");
    }

    // Retrieve student emails from the database
    const studentsCollectionRef = collection(db, "users");
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    const studentsData = studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const studentsEmail = studentsData.map((student) => student.email);
    const studentEmail = studentsEmail.filter((email) => {
      if (
        email &&
        email.endsWith("@student.uj.ac.za") &&
        !email.endsWith("@admin.uj.ac.za")
      ) {
        return email;
      }
    });
    // Retrieve lecturer emails from the database
    const lecturersCollectionRef = collection(db, "users");
    const lecturersSnapshot = await getDocs(lecturersCollectionRef);
    const lecturersData = lecturersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lecturersEmail = lecturersData.map((lecturer) => lecturer.email);
    const lecturerEmail = lecturersEmail.filter((email) => {
      if (
        email &&
        email.endsWith("@uj.ac.za") &&
        !email.endsWith("@admin.uj.ac.za")
      ) {
        return email;
      }
    });
    // Create a Set to store unique emails
    const uniqueEmails = new Set([...studentEmail, ...lecturerEmail]);
    // Convert the Set back to an array
    const everyoneEmail = Array.from(uniqueEmails);
    console.log(everyoneEmail)

    if (recipient === "student") {
      console.log("Sending email to students", studentEmail);
    } else if (recipient === "lecturer") {
      console.log("Sending email to lecturers", lecturerEmail);
    } else if (recipient === "everyone") {
      console.log("Sending email to everyone", everyoneEmail);
    }

    // Email notificaion to students, lecturer or everyone
    try {
      const docRef = await addDoc(collection(db, "mail"), {
        to: recipient === "everyone" ? everyoneEmail : recipient === "student" ? studentEmail : lecturerEmail,
        // to: "bosengad@gmail.com", // For testing purposes
        message: {
          subject: `Announcements Notifications`,
          html: `
          <div style="background-color: #f2f2f2; padding: 5px; height: 100%">
            <div style="padding:30px; background-color: #ffffff">
              <div style="height: 100%; padding-right: 10%; padding-left: 20%;">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/af/University_of_Johannesburg_Logo.svg/1200px-University_of_Johannesburg_Logo.svg.png" alt="University Logo" style="max-width: 50px; max-height: 50px; padding-right: 0%; padding-left: 30%;" /> <br/>
                <h2 style="color: #333; font-size: 25px" className:"text-red-700" >Mass Notification</h2>
              </div>
              <p style=" padding-right: 0%; padding-left: 0%;">A new announcement has been posted by ${name}.</p>
              <p style=" padding-right: 0%; padding-left: 0%;">Please check the timeline for more details.</p>
            </div>
          </div>
          <div>
            <p style="color: #888; font-size: 10px">This email was sent to you by MASS. Please do not reply to this email.</p>
          </div>
        `,
        },
      });
      console.log("Document written with ID: ", docRef.id);
      console.log("Email sent successfully!: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  setIsSubmitting(false);
  };
  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <Card className="w-full max-w-[50rem] mb-5">
        <CardHeader
          color="gray"
          floated={false}
          shadow={false}
          className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
        >
          <div className="mb-4 rounded-full border border-white/10 bg-white/10 text-white">
            <img src={UJLogo} alt="UJ Logo" className="rounded-full" />
          </div>
          <Typography variant="h4" color="white">
            Announcements
          </Typography>
        </CardHeader>
        <CardBody className="w-[700px]">
          <form className="mt-12 flex flex-col ">
            <div>
              <Typography
                variant="small"
                color="gray"
                className="my-5 font-normal"
              >
                Title of Announcement
              </Typography>
              <Input
                type="text"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="my-6">
              <Typography
                variant="small"
                color="gray"
                className="my-5 font-normal"
              >
                Description of Announcement
              </Typography>
              <Editor
                value={text}
                onTextChange={(e) => setText(e.textValue)}
                style={{ height: "320px" }}
                headerTemplate={header}
              />
            </div>
            <div className="mb-5">
              <List className="flex-row w-full">
                {radio.map((item) => (
                  <ListItem className="p-0" key={item.id}>
                    <label
                      htmlFor="horizontal-list-react"
                      className="flex w-full cursor-pointer items-center px-0 py-2"
                    >
                      <ListItemPrefix className="mr-3">
                        <Radio
                          name="horizontal-list"
                          id="horizontal-list-react"
                          ripple={false}
                          checked={recipient === item.value}
                          onChange={() => setRecipient(item.value)}
                          value={item.value}
                          color={item.color}
                          className="hover:before:opacity-0"
                          containerProps={{
                            className: "p-0",
                          }}
                        />
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="font-medium">
                        {item.value}
                      </Typography>
                    </label>
                  </ListItem>
                ))}
              </List>
            </div>
            <Button size="lg" className="bg-primary" onClick={handleSubmit}>
              <Typography color="white">Submit</Typography>
            </Button>
          </form>
        </CardBody>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default AnnouncementComponents;

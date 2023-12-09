import React, { useEffect, useState } from "react";
import Sidebar from "../global/Sidebar";
import NavigationBar from "../global/NavigationBar";
import Profile from "../images/profileicon.png";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Dialog,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  DialogFooter,
  Alert,
  Avatar,
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import {
  db,
  modulesCollection,
  usersCollection,
} from "../../firebase/configFirebase";
import { ToastContainer, toast } from "react-toastify";

const TABLE_HEAD = ["Member", "Function", "Cellphone", "Modules Taken", "Edit"];
const radio = [
  { id: 1, value: "everyone", color: "blue" },
  { id: 2, value: "lecturer", color: "green" },
  { id: 3, value: "student", color: "red" },
];

function Lecturer() {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [modulesData, setModulesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLecturerId, setSelectedLecturerId] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [modulesAssign, setModulesAssign] = useState("");
  const [modulExits, setModulExits] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("Fetched data from Firestore:", data);
      setUserData(data);
    });
    // console.log("Subscribed to Firestore updates");
    return () => {
      // console.log("Unsubscribing from Firestore updates");
      unsubscribe();
    };
  }, []);
  console.log("Rendering component with userData:", userData);
  const filteredLecturers = userData.filter((user) =>
    user.email.endsWith("@uj.ac.za")
  );
  console.log("Filtered lecturers:", filteredLecturers);
  const modulesTaken = userData.map((user) =>
    user.id.endsWith("@uj.ac.za")
      ? user.modules.map((module) => module.moduleCode)
      : null
  );
  console.log("Modules taken:", modulesTaken);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "modules"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        checked: false, // Set the initial checked state to false
        ...doc.data(),
      }));
      // console.log("Fetched data from Firestore (modules):", data);
      setModulesData(data);
    });
    // console.log("Subscribed to Firestore updates (modules)");
    return () => {
      // console.log("Unsubscribing from Firestore updates (modules)");
      unsubscribe();
    };
  }, [userData]);

  console.log("Rendering component with modulesData:", modulesData);

  const lecturerId = userData.find((user) =>
    user.email.endsWith("@uj.ac.za")
  )?.id;
  console.log("Lecturer id:", lecturerId);

  const assignModules = async (e) => {
    e.preventDefault();

    // Check if a lecturer is selected
    if (!selectedLecturerId) {
      console.log("No lecturer selected");
      return;
    }

    // Fetch the lecturer's document
    const lecturerRef = doc(db, "users", selectedLecturerId);
    const lecturerDoc = await getDoc(lecturerRef);
    const lecturerData = lecturerDoc.data();

    // Check if selected modules are already assigned to other users
    const assignedModules = await Promise.all(
      selectedModules.map(async (moduleCode) => {
        const moduleSnapshot = await getDoc(doc(db, "modules", moduleCode));
        const assignedTo = moduleSnapshot.data()?.assignedTo;
        console.log("Assigned to:", assignedTo);
        if (assignedTo && assignedTo !== selectedLecturerId) {
          return moduleCode;
        }
        return null;
      })
    );

    // Filter out modules that are already assigned
    const unassignedModules = assignedModules.filter(
      (moduleCode) => moduleCode
    );
    if (unassignedModules.length > 0) {
      setModulExits(true);
      console.log("Modules already assigned:", unassignedModules.join(", "));
      setModulesAssign(unassignedModules.join(", "));
      return;
    }

    // Create an array of selected modules in the correct format
    const selectedModulesData = selectedModules.map((moduleCode) => {
      const course = modulesData.find(
        (course) => course.moduleCode === moduleCode
      );
      return {
        moduleCode: course.moduleCode,
        moduleName: course.moduleName,
        moduleImage: course.image,
        assignedTo: selectedLecturerId,
        lecturerName:
          lecturerData.title +
          " " +
          lecturerData.firstname +
          " " +
          lecturerData.name,
      };
    });

    // Update the lecturer's document with the new module assignment
    await setDoc(
      lecturerRef,
      {
        modules: selectedModulesData,
      },
      { merge: true }
    );

    // Remove the lecturer's assignment from the previous module (if any)
    if (lecturerData.modules.length > 0) {
      const previousModuleRef = doc(
        db,
        "modules",
        lecturerData.modules[0].moduleCode
      );
      await setDoc(
        previousModuleRef,
        {
          assignedTo: "",
          lecturerName: "",
        },
        { merge: true }
      );
    }

    // Update the assignedTo field for each module
    await Promise.all(
      selectedModules.map(async (moduleCode) => {
        const moduleRef = doc(db, "modules", moduleCode);
        await setDoc(
          moduleRef,
          {
            assignedTo: selectedLecturerId,
            lecturerName:
              lecturerData.title +
              " " +
              lecturerData.firstname +
              " " +
              lecturerData.name,
          },
          { merge: true }
        );
      })
    );

    // Show a success toast
    toast.success("Modules assigned successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });

    // Clear the selected modules array
    setSelectedModules([]);

    // Close the dialog
    handleOpen();
  };

  const handleCheckboxChange = (moduleCode) => {
    setSelectedModules((prevSelectedModules) => {
      if (prevSelectedModules.includes(moduleCode)) {
        // If the module is already selected, remove it
        return prevSelectedModules.filter((module) => module !== moduleCode);
      } else {
        // If the module is not selected, add it
        return [...prevSelectedModules, moduleCode];
      }
    });
  };

  const handleOpen = (lecturerId) => {
    setSelectedLecturerId(lecturerId);
    setModulExits(false);
    console.log(selectedModules);
    console.log("Selected lecturer id:", selectedLecturerId);
    setOpen((cur) => !cur);
    console.log("Lecturer id: ", lecturerId);
  };
  // useEffect(() => {
  //   console.log("Selected lecturer id:", selectedLecturerId);
  //   console.log("Selected modules:", selectedModules);
  // }, [selectedLecturerId]);

  // const [openAccordion, setOpenAccordion] = useState(1);
  const [openAccordion1, setOpenAccordion1] = useState(true);
  const [openAccordion2, setOpenAccordion2] = useState(false);
  const [openAccordion3, setOpenAccordion3] = useState(false);

  const handleOpenAccordion = (value) => {
    switch (value) {
      case 1:
        setOpenAccordion1((prev) => !prev);
        setOpenAccordion2(false);
        setOpenAccordion3(false);
        break;
      case 2:
        setOpenAccordion2((prev) => !prev);
        setOpenAccordion1(false);
        setOpenAccordion3(false);
        break;
      case 3:
        setOpenAccordion3((prev) => !prev);
        setOpenAccordion1(false);
        setOpenAccordion2(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-5 mt-4">
        <NavigationBar title={"Lecturer"} />
        <Card className="h-full w-full mt-20">
          <CardHeader className="mb-4 flex h-16 place-items-center bg-primary shadow-lg">
            <Typography variant="h3" color="white" className="p-5">
              Mass Lecturer
            </Typography>
          </CardHeader>
          <Typography color="gray" className="mt-2 mx-8 font-normal">
            See information about all members
          </Typography>
          <table className="w-full min-w-max table-auto text-left mt-12">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-b p-4 bg-blue-gray-50">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            {filteredLecturers &&
              filteredLecturers.map((user) =>
                user.email.endsWith("@uj.ac.za") ? (
                  <tbody key={user.id}>
                    <tr>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.photoURL ? user.photoURL : Profile}
                            alt={user.name}
                            size="sm"
                          />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.title} {user.firstname} {user.name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {user.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.function}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {user.cellphone}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="red"
                          className="font-normal"
                        >
                          {user.modules && user.modules.length > 0
                            ? user.modules.map((module, index) => (
                                <span key={index} className="text-green-400">
                                  {module.moduleCode}
                                  {index < user.modules.length - 1 ? ", " : ""}
                                </span>
                              ))
                            : "N/A"}
                        </Typography>
                      </td>
                      <td className="">
                        <Tooltip content="Edit Modules">
                          <IconButton
                            variant="text"
                            color="deep-orange"
                            onClick={() => handleOpen(user.id)}
                          >
                            <PencilIcon className="h-5 w-5 " />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  </tbody>
                ) : null
              )}
          </table>
        </Card>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardHeader
              variant="gradient"
              // color="blue"
              className="mb-4 grid h-28 place-items-center bg-primary"
            >
              <Typography variant="h3" color="white">
                Modules Code
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              {/* <Accordion open={openAccordion1} >
                <AccordionHeader onClick={() => handleOpenAccordion(1)}>
                  First Year
                </AccordionHeader>
                <AccordionBody>
                  {modulesData &&
                    modulesData
                      .filter((course) => course.yearLevel === "1")
                      .map((course, index) => (
                        <div className="-ml-2.5" key={course.id}>
                          <Checkbox
                            label={course.moduleCode}
                            checked={selectedModules.includes(
                              course.moduleCode
                            )}
                            onChange={() =>
                              handleCheckboxChange(course.moduleCode)
                            }
                          />
                        </div>
                      ))}
                  {modulExits && (
                    <Alert
                      icon={<WarningIcon />}
                      className="rounded-none border-l-4 border-red-700 bg-[#2ec946]/10 font-medium text-red-700 "
                    >
                      A lecturer already assigned to {modulesAssign}
                    </Alert>
                  )}
                </AccordionBody>
              </Accordion> */}
              {/* <Accordion open={openAccordion2} >
                <AccordionHeader onClick={() => handleOpenAccordion(2)}>
                  Second Year
                </AccordionHeader>
                <AccordionBody>
                  {modulesData &&
                    modulesData
                      .filter((course) => course.yearLevel === "2" )
                      .map((course, index) => (
                        <div className="-ml-2.5" key={course.id}>
                          <Checkbox
                            label={course.moduleCode}
                            checked={selectedModules.includes(
                              course.moduleCode
                            )}
                            onChange={() =>
                              handleCheckboxChange(course.moduleCode)
                            }
                          />
                        </div>
                      ))}
                  {modulExits && (
                    <Alert
                      icon={<WarningIcon />}
                      className="rounded-none border-l-4 border-red-700 bg-[#2ec946]/10 font-medium text-red-700 "
                    >
                      A lecturer already assigned to {modulesAssign}
                    </Alert>
                  )}
                </AccordionBody>
              </Accordion> */}
              <Accordion open={openAccordion3}>
                <AccordionHeader onClick={() => handleOpenAccordion(3)}>
                  Third Year
                </AccordionHeader>
                <AccordionBody>
                  {modulesData &&
                    modulesData
                      .filter((course) => course.yearLevel === "3")
                      .map((course, index) => (
                        <div className="-ml-2.5" key={course.id}>
                          <Checkbox
                            label={course.moduleCode}
                            checked={selectedModules.includes(
                              course.moduleCode
                            )}
                            onChange={() =>
                              handleCheckboxChange(course.moduleCode)
                            }
                          />
                        </div>
                      ))}
                  {modulExits && (
                    <Alert
                      icon={<WarningIcon />}
                      className="rounded-none border-l-4 border-red-700 bg-[#2ec946]/10 font-medium text-red-700 "
                    >
                      A lecturer already assigned to {modulesAssign}
                    </Alert>
                  )}
                </AccordionBody>
              </Accordion>
            </CardBody>
            <DialogFooter className="pt-0">
              <Button
                variant="text"
                color="deep-purple"
                onClick={handleOpen}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="gradient"
                color="deep-orange"
                onClick={assignModules}
              >
                <span>Confirm</span>
              </Button>
            </DialogFooter>
          </Card>
        </Dialog>
        <ToastContainer />
      </div>
    </div>
  );
}
export default Lecturer;

import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Alert,
} from "@material-tailwind/react";

function TabsProgram() {
  const [selectedTab, setSelectedTab] = useState("1");
  const data = [
    {
      label: "Business Information Technology",
      value: "1",
      classes: [
        {
          year: "First Year",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 120,
          yearlabel: "1st",
        },
        {
          year: "Second Year",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 96,
          yearlabel: "2nd",
        },
        {
          year: "Third Year",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 75,
          yearlabel: "3rd",
        },
        {
          year: "Advance Diploma",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 70,
          yearlabel: "AD",
        },
      ],
    },
    {
      label: "Bcom Information Systems",
      value: "2",
      classes: [
        {
          year: "First Year",
          numberOfModules: 6,
          numberOfLecturers: 6,
          numberOfStudents: 128,
          yearlabel: "1st",
        },
        {
          year: "Second Year",
          numberOfModules: 6,
          numberOfLecturers: 6,
          numberOfStudents: 98,
          yearlabel: "2nd",
        },
        {
          year: "Third Year",
          numberOfModules: 5,
          numberOfLecturers: 5,
          numberOfStudents: 86,
          yearlabel: "3rd",
        },
      ],
    },

    {
      label: "Postgraduate Information Systems",
      value: "3",
      classes: [
        {
          year: "Bcom Honours Information Systems",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 120,
          yearlabel: "Hons",
        },
        {
          year: "Mcom IT Management",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 120,
          yearlabel: "Mcom",
        },
        {
          year: "PhD IT Management",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 120,
          yearlabel: "PhD",
        },
      ],
    },
    {
      label: "Short Learning Programmes",
      value: "4",
      classes: [
        {
          year: "Computational Intelligence SLP",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 120,
          yearlabel: "CI",
        },
        {
          year: "End User Computing SLP",
          numberOfModules: 8,
          numberOfLecturers: 8,
          numberOfStudents: 120,
          yearlabel: "EUC",
        },
      ],
    },
  ];

  return (
    <div>
      <Tabs id="custom-animation" value={selectedTab}>
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              className={
                selectedTab === value
                  ? "bg-white text-primary border-b-2 border-primary"
                  : "bg-primary text-white"
                  
              }
              onClick={() => setSelectedTab(value)}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {data.map(({ value, desc, classes }) => (
            <TabPanel key={value} value={value}>
              {classes.map((item) => (
                <Alert
                  className="rounded-none border-l-8 border-primary bg-primary/10 font-medium text-black my-5 space-y-4"
                  key={item.year}
                >
                  <div className="flex items-center gap-4 ">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary">
                      <span className="text-2xl font-normal text-white">
                        {item.yearlabel}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Number of Modules: {item.numberOfModules}
                      </span>
                      <span className="text-sm font-medium">
                        Number of Lecturer: {item.numberOfLecturers}
                      </span>
                      <span className="text-sm font-medium">
                        Number of Student: {item.numberOfStudents}
                      </span>
                      <span className="text-xs font-normal">{item.year}</span>
                    </div>
                  </div>
                </Alert>
              ))}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}

export default TabsProgram;

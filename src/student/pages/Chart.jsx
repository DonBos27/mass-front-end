import StatisticsChart from "../components/StatisticsChart";
import NavbarStudent from "../global/NavbarStudent";
import Sidebar from "../global/Sidebar";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import TimeSpandChart from "../components/TimeSpandChart";
function Chart({ handleProfile }) {
  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full  mx-4 mb-4 mt-4 h-full">
        <NavbarStudent
          Icon={LeaderboardIcon}
          title={"Chart"}
          handleProfile={handleProfile}
        />
        <div className="mt-4">
          <h2 className="text-3xl font-bold mb-5">Your Semester Progress</h2>
          <div className="flex flex-col justify-between">
            <div className="mt-10 ">
              <StatisticsChart />
            </div>
            <div className="mt-5 w-full">
              <h2 className="text-3xl font-bold mb-5">
                Your Time Spent Progress
              </h2>
              <TimeSpandChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;

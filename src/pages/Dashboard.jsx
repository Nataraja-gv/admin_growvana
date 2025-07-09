import React, { useEffect, useState } from "react";
import { OverAllReport } from "../services/report";

const Dashboard = () => {
  const [report, setReport] = useState();
   console.log(report,"report")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await OverAllReport();
        setReport(res?.data);
      } catch (error) {
        console.log(error?.message);
      }
    };
    fetchReports();
  }, []);
  return <div>Dashboard</div>;
};

export default Dashboard;

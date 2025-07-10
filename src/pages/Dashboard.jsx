import { useEffect, useState } from "react";
import PieCard from "../component/piecharts";
import { OverAllReport } from "../services/report";

const Dashboard = () => {
  const [report, setReport] = useState({});
  const [charts, setCharts] = useState({});

  const formatPie = (obj) => {
    return obj
      ? Object.entries(obj).map(([key, value]) => ({ name: key, value }))
      : [];
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await OverAllReport();
        const data = res?.data;
        setReport(data);

        const chartData = {
          orderPayment: formatPie(data?.orderPayment),
          productCountByCategory: formatPie(data?.productCountByCategory),
          orderPlacedDetails: formatPie(data?.orderPlacedDetails),
          subscriptionType: formatPie(data?.SubScription_type),
          subscriptionStatus: formatPie(data?.SubScription_Status),
          userPremium: formatPie(data?.users?.userPremium),
        };

        setCharts(chartData);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Report
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PieCard title="Order Payment" data={charts.orderPayment} isCurrency />

        <PieCard
          title="Product Count by Category"
          data={charts.productCountByCategory}
        />

        <PieCard title="Order Status" data={charts.orderPlacedDetails} />

        <PieCard title="Subscription Types" data={charts.subscriptionType} />

        <PieCard title="Subscription Status" data={charts.subscriptionStatus} />

        <PieCard title="User Premium Status" data={charts.userPremium} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        <StatCard
          title="Total Products"
          value={report?.products?.total_products}
          icon="🪴"
        />
        <StatCard
          title="Active Products"
          value={report?.products?.active_products}
          icon="✅"
        />
        <StatCard
          title="Inactive Products"
          value={report?.products?.inActive_products}
          icon="❌"
        />

        <StatCard
          title="Total Categories"
          value={report?.category?.total_category}
          icon="📂"
        />
        <StatCard
          title="Active Categories"
          value={report?.category?.active_category}
          icon="🔓"
        />
        <StatCard
          title="Inactive Categories"
          value={report?.category?.inActive_category}
          icon="🔒"
        />

        <StatCard title="Total Users" value={report?.users?.total_users} icon="👤" />

        <StatCard
          title="Total Subscriptions Type"
          value={report?.SubScription}
          icon="📦"
        />
        <StatCard title="Total Orders" value={report?.orderLength} icon="🛒" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex items-center gap-4">
    <div className="text-3xl text-indigo-600">{icon}</div>
    <div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;

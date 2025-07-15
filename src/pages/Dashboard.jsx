import { useEffect, useState } from "react";
import PieCard from "../component/piecharts";
import { OverAllReport } from "../services/report";
import { DatePicker } from "@mui/x-date-pickers";
import {
  fetchAllOrdersInvoice,
  fetchAllOrdersSendInvoice,
} from "../services/orders/orders";
import ShowPreviewComponent from "../sections/showPreviewComponent";
import { useSnackbar } from "notistack";

const Dashboard = () => {
  const [report, setReport] = useState({});
  const [charts, setCharts] = useState({});
  const [valueStartDate, setValueStartDate] = useState();
  const [valueEndDate, setValueEndDate] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const [showExportPDF, setShowExportPDF] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

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

  const handleMonthlyInvoice = async () => {
    try {
      const res = await fetchAllOrdersInvoice(valueStartDate, valueEndDate);
      setInvoiceData(res?.data);
      setShowPreview(true);
    } catch (error) {
      console.error("Error fetching monthly invoice:", error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await fetchAllOrdersSendInvoice(valueStartDate, valueEndDate);
      if (res?.data) {
        enqueueSnackbar("invoice sent successfully", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className=" flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Dashboard Report
        </h1>
      </div>

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

        <StatCard
          title="Total Users"
          value={report?.users?.total_users}
          icon="👤"
        />

        <StatCard
          title="Total Subscriptions Type"
          value={report?.SubScription}
          icon="📦"
        />
        <StatCard title="Total Orders" value={report?.orderLength} icon="🛒" />
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className=" flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Dashboard Invoice Report
          </h1>
          <div className="flex items-center gap-4">
            <div>
              <DatePicker
                value={valueStartDate}
                label="Select Start Date"
                onChange={(newValue) =>
                  setValueStartDate(newValue.toISOString())
                }
              />
            </div>
            <div>
              <DatePicker
                value={valueEndDate}
                label="Select End Date"
                onChange={(newValue) => setValueEndDate(newValue.toISOString())}
              />
            </div>
          </div>{" "}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
            // onClick={() => setShowPreview(true)}
            onClick={handleMonthlyInvoice}
          >
            Preview Report
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
            onClick={handleExportPDF}
          >
            Export as PDF
          </button>
        </div>
      </div>
      {showPreview && (
        <ShowPreviewComponent
          invoiceData={invoiceData}
          open={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
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

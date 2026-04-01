import SignUpForm from "@/components/auth/SignUpForm";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import BillingCard from "@/components/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Dashboard",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-6">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-6">
        {/* <MonthlyTarget /> */}
        <BillingCard />
      </div>
      
      <div className="col-span-12 xl:col-span-6">
        <MonthlySalesChart />
      </div>
      <div className="col-span-12 xl:col-span-6">
        <RecentOrders />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  ) 
}
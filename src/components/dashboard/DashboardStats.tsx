
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data for the charts
const performanceData = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 9800, expenses: 3908 },
  { name: "Apr", revenue: 3780, expenses: 2908 },
  { name: "May", revenue: 5890, expenses: 4800 },
  { name: "Jun", revenue: 8390, expenses: 3800 },
  { name: "Jul", revenue: 4490, expenses: 3300 },
];

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  percentage?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  percentage,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && percentage && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={`mr-1 ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend === "up" ? "↑" : "↓"}
            </span>
            <span
              className={`${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {percentage}
            </span>
            <span className="ml-1 text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          description="Total revenue this month"
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          percentage="20.1%"
        />
        <StatCard
          title="Subscriptions"
          value="+2350"
          description="Active subscriptions"
          icon={<Users className="h-4 w-4" />}
          trend="up"
          percentage="10.5%"
        />
        <StatCard
          title="Sales"
          value="+12,234"
          description="Total sales this month"
          icon={<ShoppingCart className="h-4 w-4" />}
          trend="down"
          percentage="5.3%"
        />
        <StatCard
          title="Active Users"
          value="24,389"
          description="Users currently active"
          icon={<BarChart3 className="h-4 w-4" />}
          trend="up"
          percentage="12.2%"
        />
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  stackId="a"
                  fill="#0284c7"
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  stackId="a"
                  fill="#38bdf8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;

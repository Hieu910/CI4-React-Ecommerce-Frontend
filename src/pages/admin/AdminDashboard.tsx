import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "@/services/api";
import { toast } from "sonner";

const chartData = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 5200 },
  { month: "Apr", revenue: 4100 },
  { month: "May", revenue: 6300 },
  { month: "Jun", revenue: 5800 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};

const AdminDashboard = () => {
  const [cardData, setCardData] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_users: 0,
    total_products: 0,
  });
  // const [chartData, setChartData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setCardData(data.cards);
        // setChartData(data.chart);
      } catch (error) {
        toast.error("Failed to fetch dashboard stats");
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: cardData.total_revenue.toFixed(2),
      icon: DollarSign,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Total Orders",
      value: cardData.total_orders,
      icon: ShoppingCart,
      color: "bg-accent/10 text-accent-foreground",
    },
    {
      title: "Customers",
      value: cardData.total_users,
      icon: Users,
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Active Products",
      value: cardData.total_products,
      icon: Package,
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

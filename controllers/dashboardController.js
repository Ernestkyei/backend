import { getDashboardStats } from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardStats();

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
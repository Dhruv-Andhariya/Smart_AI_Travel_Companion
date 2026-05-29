import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateTripPage from "@/pages/CreateTripPage";
import ItineraryPage from "@/pages/ItineraryPage";
import AIChatPage from "@/pages/AIChatPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "app",
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "chat", element: <AIChatPage /> },
          { path: "create", element: <CreateTripPage /> },
          { path: "itinerary/:tripId", element: <ItineraryPage /> },
        ],
      },
    ],
  },
]);
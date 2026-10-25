import { AppProvider, useApp } from "./context/AppContext";
import { RoleSwitcher } from "./components/ui/RoleSwitcher";
import { Toast } from "./components/ui/Feedback";
import { BottomNav, CustomerHeader, FloatingCartBar } from "./components/customer/Navigation";
import { HomePage } from "./pages/customer/HomePage";
import { SearchPage } from "./pages/customer/SearchPage";
import { CategoriesPage, CategoryListingPage } from "./pages/customer/CategoryPages";
import { ProductPage } from "./pages/customer/ProductPage";
import { CartPage } from "./pages/customer/CartPage";
import { CheckoutPage } from "./pages/customer/CheckoutPage";
import { TrackingPage } from "./pages/customer/TrackingPage";
import { OrdersPage, ProfilePage } from "./pages/customer/AccountPages";
import { StoreDashboard } from "./pages/StoreDashboard";
import { DeliveryDashboard } from "./pages/DeliveryDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

function CustomerScreen() {
  const { screen } = useApp();
  switch (screen.name) {
    case "home": return <HomePage />;
    case "search": return <SearchPage />;
    case "categories": return <CategoriesPage />;
    case "category": return <CategoryListingPage id={screen.id} />;
    case "product": return <ProductPage id={screen.id} />;
    case "cart": return <CartPage />;
    case "checkout": return <CheckoutPage />;
    case "tracking": return <TrackingPage id={screen.id} />;
    case "orders": return <OrdersPage />;
    case "profile": return <ProfilePage />;
  }
}

function Shell() {
  const { role, toast } = useApp();
  const isCustomer = role === "customer";

  return (
    <div className="min-h-screen overflow-x-hidden">
      <RoleSwitcher />
      {isCustomer && <CustomerHeader />}
      <main className={`mx-auto max-w-7xl px-4 py-5 ${isCustomer ? "pb-40 md:pb-10" : "pb-10"}`}>
        {role === "customer" && <CustomerScreen />}
        {role === "store" && <StoreDashboard />}
        {role === "delivery" && <DeliveryDashboard />}
        {role === "admin" && <AdminDashboard />}
      </main>
      {isCustomer && <FloatingCartBar />}
      {isCustomer && <BottomNav />}
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

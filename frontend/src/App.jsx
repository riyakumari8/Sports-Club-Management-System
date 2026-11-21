import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Module 1: Sports Shop
import ShopDashboard from './pages/shop/ShopDashboard';
import ProductCatalogue from './pages/shop/ProductCatalogue';
import ProductDetails from './pages/shop/ProductDetails';
import AddProduct from './pages/shop/AddProduct';
import EditProduct from './pages/shop/EditProduct';
import ProductCategories from './pages/shop/ProductCategories';

// Module 2: Inventory Management
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import StockList from './pages/inventory/StockList';
import StockIn from './pages/inventory/StockIn';
import StockAdjustment from './pages/inventory/StockAdjustment';
import StockMovementHistory from './pages/inventory/StockMovementHistory';
import LowStockAlerts from './pages/inventory/LowStockAlerts';

// Module 3: E-Commerce & Counter Sales
import CustomerShop from './pages/ecommerce/CustomerShop';
import ShoppingCart from './pages/ecommerce/ShoppingCart';
import Checkout from './pages/ecommerce/Checkout';
import MyOrders from './pages/ecommerce/MyOrders';
import OrderDetails from './pages/ecommerce/OrderDetails';
import AdminOrderManagement from './pages/ecommerce/AdminOrderManagement';
import CounterSales from './pages/ecommerce/CounterSales';

// Module 4: Cafe & Bar Management
import CafeDashboard from './pages/cafe/CafeDashboard';
import MenuDisplay from './pages/cafe/MenuDisplay';
import MenuManagement from './pages/cafe/MenuManagement';
import TableManagement from './pages/cafe/TableManagement';
import PlaceOrder from './pages/cafe/PlaceOrder';
import KitchenDashboard from './pages/cafe/KitchenDashboard';
import CafeOrderManagement from './pages/cafe/CafeOrderManagement';
import CafeBilling from './pages/cafe/CafeBilling';
import CustomerTabs from './pages/cafe/CustomerTabs';
import DailySales from './pages/cafe/DailySales';

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={closeMobileMenu} />

      {/* Main Content Area */}
      <div className="app-main-content" style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <Navbar onToggleMobileMenu={toggleMobileMenu} />

        {/* Dynamic Route Pages */}
        <main style={{ flex: 1, padding: '24px' }}>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/shop/dashboard" replace />} />

            {/* MODULE 1: SPORTS SHOP */}
            <Route path="/shop/dashboard" element={<ShopDashboard />} />
            <Route path="/shop/products" element={<ProductCatalogue />} />
            <Route path="/shop/products/:id" element={<ProductDetails />} />
            <Route path="/shop/products/add" element={<AddProduct />} />
            <Route path="/shop/products/edit/:id" element={<EditProduct />} />
            <Route path="/shop/categories" element={<ProductCategories />} />

            {/* MODULE 2: INVENTORY */}
            <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
            <Route path="/inventory/stock" element={<StockList />} />
            <Route path="/inventory/stock-in" element={<StockIn />} />
            <Route path="/inventory/adjust" element={<StockAdjustment />} />
            <Route path="/inventory/movements" element={<StockMovementHistory />} />
            <Route path="/inventory/low-stock" element={<LowStockAlerts />} />

            {/* MODULE 3: E-COMMERCE & POS */}
            <Route path="/customer/shop" element={<CustomerShop />} />
            <Route path="/customer/cart" element={<ShoppingCart />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/orders" element={<MyOrders />} />
            <Route path="/customer/orders/:orderNumber" element={<OrderDetails />} />
            <Route path="/admin/orders" element={<AdminOrderManagement />} />
            <Route path="/shop/counter-sales" element={<CounterSales />} />

            {/* MODULE 4: CAFE & BAR */}
            <Route path="/cafe/dashboard" element={<CafeDashboard />} />
            <Route path="/cafe/menu" element={<MenuDisplay />} />
            <Route path="/cafe/menu/manage" element={<MenuManagement />} />
            <Route path="/cafe/tables" element={<TableManagement />} />
            <Route path="/cafe/orders/place" element={<PlaceOrder />} />
            <Route path="/cafe/kitchen" element={<KitchenDashboard />} />
            <Route path="/cafe/orders" element={<CafeOrderManagement />} />
            <Route path="/cafe/billing" element={<CafeBilling />} />
            <Route path="/cafe/tabs" element={<CustomerTabs />} />
            <Route path="/cafe/sales" element={<DailySales />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/shop/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

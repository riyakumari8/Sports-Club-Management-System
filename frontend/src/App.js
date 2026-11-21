import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import SportsFacilities from './pages/SportsFacilities';
import CourtAvailability from './pages/CourtAvailability';
import MembershipPlans from './pages/MembershipPlans';
import ShopPreview from './pages/ShopPreview';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TestimonialsGallery from './pages/TestimonialsGallery';
import FAQ from './pages/FAQ';

// Booking & Member Pages
import BookCourt from './pages/BookCourt';
import MyBookings from './pages/MyBookings';
import FridaySocialPlay from './pages/FridaySocialPlay';

// Staff & Admin Pages
import CourtDashboard from './pages/CourtDashboard';
import AllBookingsAdmin from './pages/AllBookingsAdmin';
import FrontDeskCheckIn from './pages/FrontDeskCheckIn';
import EnquiryCRM from './pages/EnquiryCRM';
import TrialBookingsAdmin from './pages/TrialBookingsAdmin';

import './App.css';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/facilities" element={<SportsFacilities />} />
            <Route path="/availability" element={<CourtAvailability />} />
            <Route path="/membership-plans" element={<MembershipPlans />} />
            <Route path="/shop" element={<ShopPreview />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/gallery" element={<TestimonialsGallery />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Court Booking Routes */}
            <Route path="/book" element={<BookCourt />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/social-play" element={<FridaySocialPlay />} />

            {/* Admin & Desk Routes */}
            <Route path="/admin/courts" element={<CourtDashboard />} />
            <Route path="/admin/all-bookings" element={<AllBookingsAdmin />} />
            <Route path="/admin/check-in" element={<FrontDeskCheckIn />} />
            <Route path="/admin/enquiries" element={<EnquiryCRM />} />
            <Route path="/admin/trials" element={<TrialBookingsAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

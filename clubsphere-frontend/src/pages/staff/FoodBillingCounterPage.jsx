import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  Coffee,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Search,
  CheckCircle2,
  Printer,
  Sparkles,
  UserCheck,
  CreditCard,
  AlertCircle,
  Table,
} from 'lucide-react';

export const FoodBillingCounterPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Customer & Table Order state
  const [customerName, setCustomerName] = useState('Cafe Walk-in');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Discount preview
  const [membershipTier, setMembershipTier] = useState('NON_MEMBER');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Receipt popup & processing
  const [receiptModal, setReceiptModal] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    try {
      const [menuData, tablesData, billsData] = await Promise.all([
        foodShopStaffService.getMenu(),
        foodShopStaffService.getTables(),
        foodShopStaffService.getBills(),
      ]);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setTables(Array.isArray(tablesData) ? tablesData : []);
      setRecentBills(Array.isArray(billsData) ? billsData.slice(0, 10) : []);
    } catch (err) {
      console.error('Failed to load POS data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEmailBlur = () => {
    const email = customerEmail.toLowerCase().trim();
    if (email.includes('gold') || email === 'rahul.gold@gmail.com' || email === 'ananya.sharma@example.com') {
      setMembershipTier('GOLD');
      setDiscountPercent(10);
    } else if (email.includes('silver') || email === 'rohit.silver@gmail.com' || email === 'vikram.singh@example.com') {
      setMembershipTier('SILVER');
      setDiscountPercent(5);
    } else {
      setMembershipTier('NON_MEMBER');
      setDiscountPercent(0);
    }
  };

  const addToCart = (item) => {
    if (item.isAvailable === false) {
      alert(`${item.name} is currently unavailable (86ed)`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id
            ? { ...c, quantity: c.quantity + 1, total: (c.quantity + 1) * c.price }
            : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          specialNote: '',
          total: Number(item.price),
        },
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItemId === id) {
            const newQty = c.quantity + delta;
            if (newQty <= 0) return null;
            return { ...c, quantity: newQty, total: newQty * c.price };
          }
          return c;
        })
        .filter(Boolean)
    );
  };

  const updateItemNote = (id, note) => {
    setCart((prev) =>
      prev.map((c) => (c.menuItemId === id ? { ...c, specialNote: note } : c))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== id));
  };

  const clearOrder = () => {
    setCart([]);
    setCustomerName('Cafe Walk-in');
    setCustomerEmail('');
    setCustomerPhone('');
    setSelectedTable('');
    setSpecialInstructions('');
    setPaymentMethod('CASH');
    setMembershipTier('NON_MEMBER');
    setDiscountPercent(0);
    setErrorMessage('');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setErrorMessage('Please add at least one menu item');
      return;
    }
    setProcessing(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: customerName.trim() || 'Cafe Walk-in',
        customerEmail: customerEmail.trim() || null,
        customerPhone: customerPhone.trim() || null,
        tableNumber: selectedTable || null,
        paymentMethod: paymentMethod,
        specialInstructions: specialInstructions.trim() || null,
        items: cart.map((c) => ({
          menuItemId: c.menuItemId,
          quantity: c.quantity,
          specialNote: c.specialNote || null,
        })),
      };

      const result = await foodShopStaffService.createBill(payload);
      setReceiptModal(result);
      loadData();
      clearOrder();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Billing failed');
    } finally {
      setProcessing(false);
    }
  };

  const filteredMenu = menuItems.filter((m) =>
    searchQuery === ''
      ? true
      : m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.category?.name && m.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout
      title="Cafe POS & Billing Terminal"
      subtitle="Take table and counter orders, apply member discounts (Gold 10%, Silver 5%), and dispatch directly to kitchen"
    >
      {errorMessage && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(320px, 1.2fr)', gap: '1.5rem', alignItems: 'start', marginBottom: '2rem' }}>
        {/* Left: Menu Catalog Grid */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
              Cafe Menu Items
            </h3>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search coffee, wrap, bowl..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {loading ? (
            <Loader message="Loading menu..." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '0.85rem',
              maxHeight: '620px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {filteredMenu.map((m) => {
                const available = m.isAvailable !== false;
                return (
                  <div
                    key={m.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: available ? '#ffffff' : '#f9fafb',
                      opacity: available ? 1 : 0.6,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                        {m.category?.name || 'Cafe'}
                      </span>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1f2937', marginTop: '2px', lineHeight: 1.3 }}>
                        {m.name}
                      </h4>
                    </div>

                    <div style={{ marginTop: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F5132' }}>
                          ₹{Number(m.price).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: available ? '#059669' : '#dc2626', fontWeight: 600 }}>
                          {available ? 'Available' : '86ed'}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(m)}
                        disabled={!available}
                        className="btn btn-sm btn-primary"
                        style={{ width: '100%', padding: '5px' }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Table Selection, Customer Info & POS Bill Panel */}
        <div className="cs-card" style={{ background: '#fcfdfd', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={20} color="#0F5132" /> Order & Billing Tab
            </h3>
            {cart.length > 0 && (
              <button
                onClick={clearOrder}
                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Table & Customer Setup */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {/* Table Selection */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Select Table (Optional - Leave blank for Takeaway/Counter)
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{ height: '34px', fontSize: '0.85rem' }}
              >
                <option value="">Counter / Takeaway</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    Table {t.tableNumber} ({t.status} - {t.capacity} Seats)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Customer</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ height: '32px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Phone</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ height: '32px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Member Email (checks cafe discount)</label>
              <input
                type="email"
                placeholder="member@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                onBlur={handleEmailBlur}
                style={{ height: '32px', fontSize: '0.85rem' }}
              />
            </div>

            {discountPercent > 0 && (
              <div style={{ marginTop: '0.5rem', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> {membershipTier} Member! {discountPercent}% Cafe Discount Applied.
              </div>
            )}
          </div>

          {/* Cart Item Rows */}
          <div style={{ minHeight: '140px', maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9ca3af' }}>
                <Coffee size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <span>No items selected. Tap items from the left menu.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cart.map((item) => (
                  <div
                    key={item.menuItemId}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>₹{item.price}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}
                        >
                          +
                        </button>

                        <strong style={{ minWidth: '60px', textAlign: 'right', fontSize: '0.9rem' }}>
                          ₹{item.total}
                        </strong>

                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Add note: e.g. Less spicy, oat milk..."
                      value={item.specialNote}
                      onChange={(e) => updateItemNote(item.menuItemId, e.target.value)}
                      style={{ height: '26px', fontSize: '0.75rem', marginTop: '6px', width: '100%' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kitchen Special Instructions */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '2px' }}>
              Kitchen Note (Overall order instructions)
            </label>
            <input
              type="text"
              placeholder="e.g. Serve beverages first, extra napkins"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              style={{ height: '30px', fontSize: '0.8rem' }}
            />
          </div>

          {/* Financial Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                <span>Membership Discount ({discountPercent}%):</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', color: '#0F5132', borderTop: '1px solid #e5e7eb', paddingTop: '6px' }}>
              <span>Total Payable:</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {['CASH', 'UPI', 'CARD'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: paymentMethod === m ? '2px solid #0F5132' : '1px solid #d1d5db',
                    background: paymentMethod === m ? '#ecfdf5' : '#ffffff',
                    color: paymentMethod === m ? '#0F5132' : '#374151',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout & Send to Kitchen Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <CreditCard size={18} />
            {processing ? 'Processing...' : `Settle ₹${finalTotal.toLocaleString()} & Send to Kitchen`}
          </button>
        </div>
      </div>

      {/* Bill Receipt Modal */}
      {receiptModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#d1fae5', color: '#059669', marginBottom: '8px' }}>
                <CheckCircle2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937' }}>Order Sent to Kitchen!</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>ClubSphere Cafe & Lounge &bull; Bill Receipt</p>
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Bill Number:</span>
                <strong style={{ fontFamily: 'monospace' }}>{receiptModal.billNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Kitchen Order #:</span>
                <strong style={{ fontFamily: 'monospace' }}>{receiptModal.orderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Table:</span>
                <strong>{receiptModal.tableNumber ? `Table ${receiptModal.tableNumber}` : 'Counter / Takeaway'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Customer:</span>
                <span>{receiptModal.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Payment Mode:</span>
                <span>{receiptModal.paymentMethod}</span>
              </div>

              <div style={{ borderTop: '1px dashed #d1d5db', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>₹{Number(receiptModal.subtotal).toLocaleString()}</span>
                </div>
                {Number(receiptModal.discountAmount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                    <span>Membership Savings ({receiptModal.discountPercent}%):</span>
                    <span>-₹{Number(receiptModal.discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', color: '#0F5132', marginTop: '4px' }}>
                  <span>Total Paid:</span>
                  <span>₹{Number(receiptModal.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Print KOT & Bill
              </button>
              <button
                onClick={() => setReceiptModal(null)}
                className="btn btn-primary"
              >
                Done / Next Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bills History */}
      <div className="cs-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
          Recent Settled Bills
        </h3>
        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Order #</th>
                <th>Table</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total Paid</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {recentBills.map((b) => (
                <tr key={b.id}>
                  <td><strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{b.billNumber}</strong></td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{b.order?.orderNumber}</span></td>
                  <td>{b.tableNumber ? `Table ${b.tableNumber}` : 'Counter'}</td>
                  <td>₹{Number(b.subtotal).toLocaleString()}</td>
                  <td style={{ color: Number(b.discountAmount) > 0 ? '#059669' : '#6b7280' }}>
                    {Number(b.discountAmount) > 0 ? `-₹${Number(b.discountAmount).toLocaleString()}` : '--'}
                  </td>
                  <td><strong>₹{Number(b.totalAmount).toLocaleString()}</strong></td>
                  <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FoodBillingCounterPage;

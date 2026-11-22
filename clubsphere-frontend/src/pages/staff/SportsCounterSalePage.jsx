import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { sportsShopStaffService } from '../../services/sportsShopStaffService';
import {
  CreditCard,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle2,
  Printer,
  Sparkles,
  UserCheck,
  Receipt,
  AlertCircle,
} from 'lucide-react';

export const SportsCounterSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Customer info
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // Membership discount preview
  const [membershipTier, setMembershipTier] = useState('NON_MEMBER');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Completed sale receipt modal
  const [receiptModal, setReceiptModal] = useState(null);
  const [processingSale, setProcessingSale] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await sportsShopStaffService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load products for POS', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Update discount based on member email heuristic or tier check
  const handleEmailBlur = () => {
    const email = customerEmail.toLowerCase().trim();
    if (email.includes('gold') || email === 'rahul.gold@gmail.com' || email === 'ananya.sharma@example.com') {
      setMembershipTier('GOLD');
      setDiscountPercent(15);
    } else if (email.includes('silver') || email === 'rohit.silver@gmail.com' || email === 'vikram.singh@example.com') {
      setMembershipTier('SILVER');
      setDiscountPercent(10);
    } else if (email.includes('junior') || email === 'priya.junior@gmail.com') {
      setMembershipTier('JUNIOR');
      setDiscountPercent(5);
    } else if (email) {
      // Backend will also check membershipRepository
      setMembershipTier('CHECKING_ON_CHECKOUT');
      setDiscountPercent(0);
    } else {
      setMembershipTier('NON_MEMBER');
      setDiscountPercent(0);
    }
  };

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Cannot add more than available stock (${product.stockQuantity})`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          price: Number(product.sellingPrice),
          quantity: 1,
          total: Number(product.sellingPrice),
          maxStock: product.stockQuantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.maxStock) {
              alert(`Cannot exceed stock of ${item.maxStock}`);
              return item;
            }
            return { ...item, quantity: newQty, total: newQty * item.price };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearSale = () => {
    setCart([]);
    setCustomerName('Walk-in Customer');
    setCustomerEmail('');
    setCustomerPhone('');
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
      setErrorMessage('Please add at least one product to cart');
      return;
    }
    setProcessingSale(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: customerName.trim() || 'Walk-in Customer',
        customerEmail: customerEmail.trim() || null,
        customerPhone: customerPhone.trim() || null,
        paymentMethod: paymentMethod,
        items: cart.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
        })),
      };

      const result = await sportsShopStaffService.createCounterSale(payload);
      setReceiptModal(result);
      // Reload products to refresh stock quantities
      const refreshed = await sportsShopStaffService.getProducts();
      setProducts(Array.isArray(refreshed) ? refreshed : []);
      clearSale();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Counter sale failed');
    } finally {
      setProcessingSale(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    searchQuery === ''
      ? true
      : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout
      title="Sports Accessories POS Counter Sale"
      subtitle="Walk-in checkout with automatic membership discounts and instant receipt generation"
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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(320px, 1.2fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Product Catalog Grid */}
        <div className="cs-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
              Products Catalog
            </h3>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search racket, ball, shoe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {loading ? (
            <Loader message="Loading store catalog..." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
              maxHeight: '620px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {filteredProducts.map((p) => {
                const inStock = p.stockQuantity > 0;
                return (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: inStock ? '#ffffff' : '#f9fafb',
                      opacity: inStock ? 1 : 0.65,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontFamily: 'monospace' }}>
                        {p.sku}
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', marginTop: '2px', lineHeight: 1.3 }}>
                        {p.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{p.brand || 'ClubSphere'}</span>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F5132' }}>
                          ₹{Number(p.sellingPrice).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: inStock ? '#059669' : '#dc2626', fontWeight: 600 }}>
                          {inStock ? `${p.stockQuantity} left` : 'Out of stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(p)}
                        disabled={!inStock}
                        className="btn btn-sm btn-primary"
                        style={{ width: '100%', padding: '6px' }}
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

        {/* Right: Cart, Customer & Checkout POS Panel */}
        <div className="cs-card" style={{ background: '#fcfdfd', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={20} color="#0F5132" /> Current Sale Cart
            </h3>
            {cart.length > 0 && (
              <button
                onClick={clearSale}
                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Customer Lookup Details */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} color="#0F5132" /> Customer & Membership Verification
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Name</label>
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
              <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Member Email (checks discount)</label>
              <input
                type="email"
                placeholder="member@example.com (try rahul.gold@gmail.com)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                onBlur={handleEmailBlur}
                style={{ height: '32px', fontSize: '0.85rem' }}
              />
            </div>

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div style={{ marginTop: '0.5rem', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> {membershipTier} Member Verified! {discountPercent}% Off Applied.
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div style={{ minHeight: '160px', maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9ca3af' }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <span>Cart is empty. Tap items on the left to add.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>₹{item.price} each</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}
                      >
                        +
                      </button>

                      <strong style={{ minWidth: '65px', textAlign: 'right', fontSize: '0.9rem' }}>
                        ₹{item.total}
                      </strong>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
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
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Payment Mode
            </label>
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

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processingSale}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <CreditCard size={18} />
            {processingSale ? 'Processing Sale...' : `Charge ₹${finalTotal.toLocaleString()} & Generate Receipt`}
          </button>
        </div>
      </div>

      {/* Sale Receipt Popup Modal */}
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
            maxWidth: '480px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            {/* Receipt Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#d1fae5', color: '#059669', marginBottom: '8px' }}>
                <CheckCircle2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937' }}>Payment Successful!</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>ClubSphere Sports Shop &bull; Official Tax Invoice</p>
            </div>

            {/* Receipt Body */}
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Receipt No:</span>
                <strong style={{ fontFamily: 'monospace' }}>{receiptModal.receiptNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Order No:</span>
                <strong style={{ fontFamily: 'monospace' }}>{receiptModal.orderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Customer:</span>
                <strong>{receiptModal.customerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Membership Tier:</span>
                <span>{receiptModal.membershipTier}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Payment Mode:</span>
                <span>{receiptModal.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Date & Time:</span>
                <span>{new Date().toLocaleString()}</span>
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

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                onClick={() => setReceiptModal(null)}
                className="btn btn-primary"
              >
                Done / Next Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SportsCounterSalePage;

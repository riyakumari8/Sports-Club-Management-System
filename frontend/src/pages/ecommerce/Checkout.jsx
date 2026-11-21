import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaStore, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import cartApi from '../../api/cartApi';
import orderApi from '../../api/orderApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const memberId = 1;
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [orderType, setOrderType] = useState('HOME_DELIVERY'); // or 'CLUB_PICKUP'
  const [customerInfo, setCustomerInfo] = useState({
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
    specialInstructions: 'Leave with security if not available',
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CREDIT_CARD, CASH_ON_DELIVERY, MEMBER_ACCOUNT

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart(memberId);
      if (!res.data?.items || res.data.items.length === 0) {
        toast.info('Your cart is empty');
        navigate('/customer/cart');
        return;
      }
      setCart(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cart for checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerInfo.customerName || !customerInfo.customerPhone) {
      toast.error('Please fill in required contact details');
      return;
    }
    if (orderType === 'HOME_DELIVERY' && !customerInfo.deliveryAddress.trim()) {
      toast.error('Delivery address is required for Home Delivery');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        memberId,
        orderType,
        paymentMethod,
        customerName: customerInfo.customerName,
        customerEmail: customerInfo.customerEmail,
        customerPhone: customerInfo.customerPhone,
        deliveryAddress: orderType === 'HOME_DELIVERY' ? customerInfo.deliveryAddress : 'Club Pro Shop Pickup Desk',
        specialInstructions: customerInfo.specialInstructions,
        items: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      };

      const res = await orderApi.createOrder(payload);
      const createdOrder = res.data;

      // Clear the cart
      await cartApi.clearCart(memberId);

      toast.success('Order placed successfully! Stock has been reserved safely.');
      navigate(`/customer/orders/${createdOrder.orderNumber}`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to complete order checkout. Insufficient stock or concurrency error.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Preparing Secure Checkout..." />;

  const deliveryFee = orderType === 'HOME_DELIVERY' ? 100 : 0;
  const grandTotal = (cart?.totalAmount || 0) + deliveryFee;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <button
        onClick={() => navigate('/customer/cart')}
        className="btn btn-outline"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Return to Cart
      </button>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0' }}>Order Checkout</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
        Complete your sports order. Inventory is reserved with pessimistic concurrency locks upon confirmation.
      </p>

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Left Form: Delivery & Contact & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Step 1: Order Type */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px 0' }}>
                1. Delivery or Pickup
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div
                  onClick={() => setOrderType('HOME_DELIVERY')}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${orderType === 'HOME_DELIVERY' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    backgroundColor: orderType === 'HOME_DELIVERY' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <FaTruck style={{ color: 'var(--primary-color)' }} /> Home Delivery
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Dispatched to your residential address (+₹100)
                  </div>
                </div>

                <div
                  onClick={() => setOrderType('CLUB_PICKUP')}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${orderType === 'CLUB_PICKUP' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    backgroundColor: orderType === 'CLUB_PICKUP' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <FaStore style={{ color: 'var(--primary-color)' }} /> Club Pro Shop Pickup
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Collect at Sports Club Front Desk (Free)
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Customer Contact */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px 0' }}>
                2. Contact & Address Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Recipient Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={customerInfo.customerName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Contact Phone *</label>
                  <input
                    type="text"
                    name="customerPhone"
                    value={customerInfo.customerPhone}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={customerInfo.customerEmail}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              {orderType === 'HOME_DELIVERY' && (
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Delivery Address *</label>
                  <textarea
                    rows="2"
                    name="deliveryAddress"
                    value={customerInfo.deliveryAddress}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              )}

              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Special Delivery / Pickup Notes</label>
                <input
                  type="text"
                  name="specialInstructions"
                  value={customerInfo.specialInstructions}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px 0' }}>
                3. Payment Method
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {['UPI', 'CREDIT_CARD', 'CASH_ON_DELIVERY', 'MEMBER_ACCOUNT'].map((method) => (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `2px solid ${paymentMethod === method ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      backgroundColor: paymentMethod === method ? 'var(--primary-light)' : 'white',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {method.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary: Items & Total */}
          <div className="card" style={{ padding: '24px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Review
            </h2>

            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.productName}</strong>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      Qty: {item.quantity} x ₹{Number(item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{Number(item.totalPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
              <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
            </div>

            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '14px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Final Total</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <FaLock /> {submitting ? 'Confirming & Reserving...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

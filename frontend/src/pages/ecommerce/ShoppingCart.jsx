import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import cartApi from '../../api/cartApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const memberId = 1;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart(memberId);
      setCart(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load shopping cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQty, availableStock) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    if (newQty > availableStock) {
      toast.warning(`Only ${availableStock} units available in stock!`);
      return;
    }

    try {
      const res = await cartApi.updateItemQuantity(memberId, itemId, newQty);
      setCart(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await cartApi.removeItem(memberId, itemId);
      setCart(res.data);
      toast.info('Item removed from cart');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartApi.clearCart(memberId);
      setCart({ items: [], totalAmount: 0 });
      toast.info('Cart cleared');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Shopping Cart..." />;

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your basket
          </p>
        </div>
        {!isEmpty && (
          <button onClick={handleClearCart} className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', fontSize: '0.85rem' }}>
            Clear Cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '32px' }}>
            <FaShoppingBag />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 24px auto' }}>
            Looks like you haven't added any sports gear to your cart yet. Explore our pro shop catalogue!
          </p>
          <Link to="/customer/shop" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FaArrowLeft /> Browse Sports Store
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div className="card" style={{ padding: '24px' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th style={{ width: '130px' }}>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.productImageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=100&q=80'}
                            alt={item.productName}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{item.productName}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              Stock: {item.availableStock} available
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{Number(item.unitPrice).toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', width: 'fit-content' }}>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.availableStock)}
                            style={{ width: '28px', height: '28px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                          >
                            -
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.availableStock)}
                            style={{ width: '28px', height: '28px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                        ₹{Number(item.totalPrice).toFixed(2)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '6px' }}
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px' }}>
              <Link to="/customer/shop" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FaArrowLeft /> Add more sports gear
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{Number(cart.totalAmount).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery / Handling</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Calculated at Checkout</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Member Privilege Discount</span>
              <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Included</span>
            </div>

            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                ₹{Number(cart.totalAmount).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/customer/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Proceed to Checkout <FaArrowRight />
            </button>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', justifyContent: 'center' }}>
              <FaShieldAlt style={{ color: 'var(--primary-color)' }} /> Concurrency-safe pessimistic lock inventory reservation
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUtensils, FaPlus, FaTrash, FaCheckCircle, FaConciergeBell } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramTableId = searchParams.get('tableId');
  const paramItemId = searchParams.get('itemId');

  const [orderType, setOrderType] = useState('DINE_IN');
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(paramTableId || '');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState('Member / Walk-in');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tableRes, menuRes] = await Promise.all([
        cafeApi.getAllTables(),
        cafeApi.getAllMenuItems(),
      ]);

      const tList = tableRes.data || [];
      const mList = menuRes.data || [];

      setTables(tList);
      setMenuItems(mList);

      if (paramTableId) {
        setSelectedTableId(paramTableId);
      } else if (tList.length > 0) {
        setSelectedTableId(tList[0].id);
      }

      if (paramItemId) {
        const item = mList.find((m) => String(m.id) === String(paramItemId));
        if (item) {
          setSelectedItems([{ menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load menu or table data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item) => {
    if (!item.isAvailable) {
      toast.warning('This item is currently out of stock in the kitchen');
      return;
    }

    const existingIdx = selectedItems.findIndex((i) => i.menuItemId === item.id);
    if (existingIdx > -1) {
      const updated = [...selectedItems];
      updated[existingIdx].quantity += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleUpdateQty = (index, delta) => {
    const updated = [...selectedItems];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
    } else {
      updated[index].quantity = newQty;
      setSelectedItems(updated);
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error('Please select at least one menu item');
      return;
    }
    if (orderType === 'DINE_IN' && !selectedTableId) {
      toast.error('Please select a dining table');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        orderType,
        tableId: orderType === 'DINE_IN' ? selectedTableId : null,
        customerName,
        specialInstructions,
        items: selectedItems.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
      };

      await cafeApi.createOrder(payload);
      toast.success('Order fired to the kitchen successfully!');
      navigate('/cafe/kitchen');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit cafe order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Preparing Cafe Order Station..." />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0' }}>Place Cafe / Bar Order</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Send orders directly to the Kitchen Order Display (KDS) for preparation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left: Dish Selector */}
        <div className="card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 16px 0' }}>Select Dishes & Shakes</h2>
          <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: !item.isAvailable ? '#f8fafc' : 'white',
                  opacity: !item.isAvailable ? 0.6 : 1,
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {item.categoryName} • ₹{Number(item.price).toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddItem(item)}
                  disabled={!item.isAvailable}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FaPlus /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Form & Items Summary */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Order Details
          </h2>

          <form onSubmit={handleSubmitOrder}>
            {/* Order Type Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setOrderType('DINE_IN')}
                className={`btn ${orderType === 'DINE_IN' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '10px', fontWeight: 700 }}
              >
                Dine-In Table
              </button>
              <button
                type="button"
                onClick={() => setOrderType('TAKEAWAY')}
                className={`btn ${orderType === 'TAKEAWAY' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '10px', fontWeight: 700 }}
              >
                Takeaway Counter
              </button>
            </div>

            {/* Table Select if Dine-In */}
            {orderType === 'DINE_IN' && (
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Dining Table *</label>
                <select
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  className="form-control"
                  required
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table {t.tableNumber} ({t.capacity} Seats - {t.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Guest / Member Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-control"
                placeholder="e.g. Ramesh Patel"
              />
            </div>

            {/* Selected Items */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Selected Dishes ({selectedItems.length})</label>
              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {selectedItems.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
                    Click dishes from the left to add to order.
                  </div>
                ) : (
                  selectedItems.map((item, idx) => (
                    <div key={item.menuItemId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button type="button" onClick={() => handleUpdateQty(idx, -1)} style={{ width: '24px', height: '24px', background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>-</button>
                        <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button type="button" onClick={() => handleUpdateQty(idx, 1)} style={{ width: '24px', height: '24px', background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>+</button>
                        <span style={{ fontWeight: 700, marginLeft: '8px', minWidth: '60px', textAlign: 'right' }}>
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Special Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Special Chef Instructions</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra spicy, no onions, gluten free"
                className="form-control"
              />
            </div>

            {/* Total */}
            <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Estimated Bill</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || selectedItems.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <FaConciergeBell /> {submitting ? 'Sending to Kitchen...' : 'Send Order to Kitchen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;

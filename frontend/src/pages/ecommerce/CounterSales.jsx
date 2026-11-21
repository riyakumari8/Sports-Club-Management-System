import React, { useState, useEffect } from 'react';
import { FaCashRegister, FaSearch, FaPlus, FaTrash, FaPrint, FaCheckCircle } from 'react-icons/fa';
import productApi from '../../api/productApi';
import counterSaleApi from '../../api/counterSaleApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CounterSales = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [submitting, setSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (product) => {
    if (product.availableStock <= 0) {
      toast.warning('Product is out of stock!');
      return;
    }

    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      const existing = cartItems[existingIndex];
      if (existing.quantity + 1 > product.availableStock) {
        toast.warning(`Cannot exceed available stock (${product.availableStock} units)`);
        return;
      }
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.sellingPrice,
          availableStock: product.availableStock,
          quantity: 1,
        },
      ]);
    }
  };

  const handleUpdateQty = (index, delta) => {
    const updated = [...cartItems];
    const item = updated[index];
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCartItems(cartItems.filter((_, idx) => idx !== index));
      return;
    }
    if (newQty > item.availableStock) {
      toast.warning(`Only ${item.availableStock} units available`);
      return;
    }
    item.quantity = newQty;
    setCartItems(updated);
  };

  const handleRemove = (index) => {
    setCartItems(cartItems.filter((_, idx) => idx !== index));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleCompleteSale = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Add at least one product to the sale bill');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      const res = await counterSaleApi.createSale(payload);
      setCompletedSale(res.data);
      toast.success('Counter sale completed! Shared inventory updated immediately.');
      setCartItems([]);
      loadProducts(); // refresh available stocks
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to complete sale. Insufficient stock.');
    } finally {
      setSubmitting(false);
    }
  };

  const printReceipt = (sale) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(27, 94, 32);
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('ClubSphere Pro Shop - Counter Sale Receipt', 14, 16);
      doc.setFontSize(9);
      doc.text('Physical Store Counter POS Register', 14, 24);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.text(`Receipt #: ${sale.receiptNumber || 'POS-' + sale.id}`, 14, 40);
      doc.text(`Date: ${new Date(sale.createdAt || Date.now()).toLocaleString()}`, 14, 46);
      doc.text(`Customer: ${sale.customerName || 'Walk-in'}`, 14, 52);
      doc.text(`Payment: ${sale.paymentMethod}`, 14, 58);

      const tableData = (sale.items || []).map((i, idx) => [
        idx + 1,
        i.productName,
        `Rs. ${Number(i.unitPrice).toFixed(2)}`,
        i.quantity,
        `Rs. ${Number(i.totalPrice).toFixed(2)}`,
      ]);

      doc.autoTable({
        startY: 66,
        head: [['#', 'Item', 'Rate', 'Qty', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(13);
      doc.setTextColor(27, 94, 32);
      doc.text(`Total Amount Paid: Rs. ${Number(sale.totalAmount).toFixed(2)}`, 130, finalY);

      doc.save(`Receipt-${sale.receiptNumber || sale.id}.pdf`);
      toast.success('Receipt PDF saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF receipt');
    }
  };

  if (loading) return <LoadingSpinner message="Opening Counter POS Terminal..." />;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaCashRegister style={{ color: 'var(--primary-color)' }} /> Pro Shop Counter POS
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Instant register for in-person member and visitor sports equipment purchases.
          </p>
        </div>
        <div style={{ fontSize: '0.85rem', padding: '6px 14px', backgroundColor: '#e8f5e9', color: '#166534', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
          Shared Live Inventory Connected
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left: Product Selector */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search gear by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredProducts.map((p) => {
              const out = p.availableStock <= 0;
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: out ? '#f8fafc' : 'white',
                    opacity: out ? 0.6 : 1,
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.92rem' }}>{p.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Stock: <span style={{ fontWeight: 700, color: out ? 'var(--danger-color)' : 'var(--primary-accent)' }}>{p.availableStock}</span> | Rate: ₹{Number(p.sellingPrice).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddItem(p)}
                    disabled={out}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Current POS Register Bill */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Current Bill
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-control"
              placeholder="e.g. John Doe / Member #401"
            />
          </div>

          {/* Bill Items */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                No items added. Click products on the left to ring up.
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      ₹{item.unitPrice} each
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 12px' }}>
                    <button onClick={() => handleUpdateQty(idx, -1)} style={{ width: '24px', height: '24px', background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>-</button>
                    <span style={{ fontWeight: 700, width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(idx, 1)} style={{ width: '24px', height: '24px', background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>+</button>
                  </div>

                  <div style={{ fontWeight: 700, minWidth: '70px', textAlign: 'right' }}>
                    ₹{(item.quantity * item.unitPrice).toFixed(2)}
                  </div>

                  <button onClick={() => handleRemove(idx)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', marginLeft: '8px' }}>
                    <FaTrash size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['CASH', 'UPI', 'CREDIT_CARD'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`btn ${paymentMethod === m ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px', fontSize: '0.8rem' }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Total & Action */}
          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Payable</span>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
              ₹{calculateSubtotal().toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={submitting || cartItems.length === 0}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <FaCashRegister /> {submitting ? 'Recording Sale...' : 'Complete Sale & Deduct Stock'}
          </button>
        </div>
      </div>

      {/* Completed Sale Notification Banner with PDF print */}
      {completedSale && (
        <div style={{ marginTop: '28px', backgroundColor: '#e8f5e9', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaCheckCircle style={{ color: 'var(--success-color)', fontSize: '26px' }} />
            <div>
              <strong style={{ color: '#166534', fontSize: '1.1rem' }}>
                Sale Recorded Successfully (Receipt: {completedSale.receiptNumber || 'POS-' + completedSale.id})
              </strong>
              <div style={{ color: '#14532d', fontSize: '0.85rem' }}>
                Total: ₹{Number(completedSale.totalAmount).toFixed(2)} | Method: {completedSale.paymentMethod}
              </div>
            </div>
          </div>
          <button
            onClick={() => printReceipt(completedSale)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <FaPrint /> Download PDF Receipt
          </button>
        </div>
      )}
    </div>
  );
};

export default CounterSales;

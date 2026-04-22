import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });
  const [filter, setFilter] = useState('All');

  const fetchExpenses = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: filter !== 'All' ? { category: filter } : {}
      };
      const { data } = await axios.get('/api/expenses', config);
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, filter]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/expense', formData, config);
      setFormData({ title: '', amount: '', category: 'Food' }); // reset
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Hello, {user?.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here's your expense breakdown</p>
        </div>
        <button onClick={logout} className="btn btn-danger" style={{ width: 'auto' }}>
          Logout
        </button>
      </header>

      <div className="dashboard-grid">
        <div>
          <div className="glass-panel total-card">
            <h3 className="total-title">Total Expenses</h3>
            <div className="total-amount">${totalAmount.toFixed(2)}</div>
          </div>

          <div className="glass-panel expense-form-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Expense</h3>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" name="title" value={formData.title} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input type="number" className="form-input" name="amount" value={formData.amount} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={formData.category} onChange={onChange}>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Add Expense</button>
            </form>
          </div>
        </div>

        <div className="glass-panel expense-list-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Expenses</h3>
            <select className="form-select" style={{ width: '150px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            {expenses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No expenses found.</p>
            ) : (
              expenses.map(expense => (
                <div key={expense._id} className="expense-item">
                  <div>
                    <div className="expense-info-title">{expense.title}</div>
                    <div className="expense-info-meta">
                      <span className="badge">{expense.category}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="expense-amount">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

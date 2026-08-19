import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Plus, DollarSign, Calendar, Download, Image as ImageIcon, FileText } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { downloadDashboardImage, downloadDashboardPDF } from '../../lib/printDashboard';

interface Expense {
  id: string;
  amount: number;
  reason: string;
  date: any;
}

export default function AdminDashboard() {
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseReason, setExpenseReason] = useState('');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    profit: 0
  });

  useEffect(() => {
    // Listen to products count
    const unsubscribeProducts = onSnapshot(query(collection(db, 'products')), (snapshot) => {
      setStats(prev => ({ ...prev, products: snapshot.size }));
    });

    // Listen to orders count, calculate revenue and net profit
    const unsubscribeOrders = onSnapshot(query(collection(db, 'orders')), (snapshot) => {
      let totalRev = 0;
      let totalDelivery = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'Delivered') {
          totalRev += (data.totalAmount || 0);
          totalDelivery += (data.deliveryCharge || 0);
        }
      });
      setStats(prev => ({ ...prev, orders: snapshot.size, revenue: totalRev, profit: totalRev - totalDelivery }));
    });

    
    // Listen to expenses
    const unsubscribeExpenses = onSnapshot(query(collection(db, 'expenses'), orderBy('date', 'desc')), (snapshot) => {
      const expList: Expense[] = [];
      snapshot.forEach(doc => {
        expList.push({ id: doc.id, ...doc.data() } as Expense);
      });
      setExpenses(expList);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeExpenses();
    };
  }, []);

  

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || !expenseReason) return;
    
    setIsAddingExpense(true);
    try {
      await addDoc(collection(db, 'expenses'), {
        amount: Number(expenseAmount),
        reason: expenseReason,
        date: serverTimestamp()
      });
      setExpenseAmount('');
      setExpenseReason('');
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsAddingExpense(false);
    }
  };

  
  const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const finalNetProfit = stats.profit - totalExpense;

  
  const monthlyExpenses = expenses.reduce((acc, exp) => {
    let dateObj = new Date();
    if (exp.date && typeof exp.date.toDate === 'function') {
      dateObj = exp.date.toDate();
    } else if (exp.date && exp.date.seconds) {
      dateObj = new Date(exp.date.seconds * 1000);
    }
    const monthYear = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    acc[monthYear] = (acc[monthYear] || 0) + (exp.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Dashboard Overview</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Store Performance Metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={async () => {
              setIsExporting(true);
              try {
                await downloadDashboardImage({ stats, expenses, totalExpense, monthlyExpenses, finalNetProfit });
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="flex items-center gap-2 bg-surface-container border border-outline-variant px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors text-on-surface disabled:opacity-50"
          >
            <ImageIcon className="w-4 h-4 text-primary" />
            Image
          </button>
          <button 
            onClick={async () => {
              setIsExporting(true);
              try {
                await downloadDashboardPDF({ stats, expenses, totalExpense, monthlyExpenses, finalNetProfit });
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="flex items-center gap-2 bg-surface-container border border-outline-variant px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors text-on-surface disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-primary" />
            PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Products</h3>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="pt-6">
            <p className="text-4xl font-black text-on-background">{stats.products}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Orders</h3>
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <div className="pt-6">
            <p className="text-4xl font-black text-on-background">{stats.orders}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Revenue</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="pt-6 flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-500">৳</span>
            <p className="text-4xl font-black text-on-background">{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Profit</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="pt-6 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">৳</span>
            <p className="text-4xl font-black text-on-background">{stats.profit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 mt-8">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-6">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-on-background">Business Expenses</h2>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Track and manage your store costs</p>
          </div>
          <DollarSign className="w-6 h-6 text-primary" />
        </div>

        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form & Totals */}
          <div className="lg:col-span-1 space-y-6">
            <form onSubmit={handleAddExpense} className="space-y-4 bg-surface-container-low p-4 border border-outline-variant rounded-none">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Expense Amount (৳)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-surface border border-outline-variant px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Reason / Description</label>
                <input
                  type="text"
                  required
                  value={expenseReason}
                  onChange={(e) => setExpenseReason(e.target.value)}
                  className="w-full bg-surface border border-outline-variant px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Facebook Ads"
                />
              </div>
              <button
                type="submit"
                disabled={isAddingExpense}
                className="w-full bg-primary text-on-primary py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAddingExpense ? 'Adding...' : <><Plus className="w-4 h-4" /> Add Expense</>}
              </button>
            </form>

            <div className="space-y-4">
              <div className="bg-surface-container-low border border-outline-variant p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Expenses (All Time)</p>
                <p className="text-2xl font-black text-primary">৳ {totalExpense.toLocaleString()}</p>
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant">
                  <Calendar className="w-4 h-4 text-on-surface-variant" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Monthly Breakdown</p>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(monthlyExpenses).length > 0 ? (
                    Object.entries(monthlyExpenses).map(([month, amount]) => (
                      <div key={month} className="flex justify-between items-center text-sm">
                        <span className="text-on-surface-variant">{month}</span>
                        <span className="font-bold text-on-surface">৳ {amount.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">No monthly data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Expense History</h3>
            <div className="bg-surface border border-outline-variant">
              <div className="custom-scrollbar">
                {expenses.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-lowest sticky top-0 z-10 border-b border-outline-variant">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Reason</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {expenses.map((expense) => {
                        let dateStr = 'Just now';
                        if (expense.date && typeof expense.date.toDate === 'function') {
                          dateStr = expense.date.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                        } else if (expense.date && expense.date.seconds) {
                          dateStr = new Date(expense.date.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                        }
                        
                        return (
                          <tr key={expense.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-4 py-3 text-sm text-on-surface-variant whitespace-nowrap">{dateStr}</td>
                            <td className="px-4 py-3 text-sm text-on-surface font-medium">{expense.reason}</td>
                            <td className="px-4 py-3 text-sm text-primary font-bold text-right whitespace-nowrap">৳ {expense.amount.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
                    <DollarSign className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No expenses recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Final Net Profit Section */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-on-background">Net Profit</h2>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Total Profit after all Business Expenses</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold mr-2 text-primary">৳</span>
            <span className={`text-5xl font-black ${finalNetProfit < 0 ? 'text-red-500' : 'text-on-background'}`}>
              {finalNetProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

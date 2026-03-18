import React, { useState } from "react";
    import { useRoom } from "../context/RoomContext";
    import { 
    ReceiptIndianRupee, 
    Plus, 
    Trash2, 
    Calendar, 
    Tag, 
    FileText,
    TrendingDown,
    PieChart
    } from "lucide-react";
    import { motion } from "framer-motion";

    const ExpenseManager = () => {
    const { expenses, loading, addExpense, deleteExpense } = useRoom();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        title: "",
        amount: "",
        category: "Other",
        description: ""
    });

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
        await addExpense(newExpense);
        setNewExpense({ title: "", amount: "", category: "Other", description: "" });
        setShowAddForm(false);
        } catch (error) {
        alert("Failed to add expense");
        }
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (loading) return <div className="text-slate-400">Loading expenses...</div>;

    return (
        <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold">Expense Tracking</h2>
            <p className="text-slate-400">Monitor your property maintenance and utility costs.</p>
            </div>
            <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all font-medium"
            >
            <Plus size={18} />
            {showAddForm ? "Cancel" : "Add New Expense"}
            </button>
        </div>

        {/* Expense Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card p-6 flex items-center justify-between bg-gradient-to-br from-slate-800 to-slate-900 border-none">
            <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Expenses This Month</p>
                <h3 className="text-4xl font-bold mt-2 text-rose-400">₹{totalExpenses.toLocaleString()}</h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <TrendingDown size={12} />
                Calculated from {expenses.length} entries
                </p>
            </div>
            <div className="p-5 bg-rose-500/10 text-rose-400 rounded-2xl">
                <ReceiptIndianRupee size={48} />
            </div>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <PieChart size={40} className="text-blue-400 mb-2" />
            <h4 className="font-semibold text-slate-200">Profitability</h4>
            <p className="text-xs text-slate-400 mt-1">Visit Dashboard for full breakdown</p>
            <button className="mt-4 text-sm text-blue-400 font-bold hover:underline">View Stats</button>
            </div>
        </div>

        {showAddForm && (
            <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-card p-6 overflow-hidden"
            >
            <h3 className="text-lg font-bold mb-4">Log New Expense</h3>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Title</label>
                <input 
                    required
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                    placeholder="e.g. Electricity Bill" 
                    className="w-full bg-[#161e2e] border border-slate-700/50 rounded-xl py-2 px-4 outline-none focus:ring-1 focus:ring-blue-500"
                />
                </div>
                <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Amount (₹)</label>
                <input 
                    required
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-[#161e2e] border border-slate-700/50 rounded-xl py-2 px-4 outline-none focus:ring-1 focus:ring-blue-500"
                />
                </div>
                <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Category</label>
                <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full bg-[#161e2e] border border-slate-700/50 rounded-xl py-2 px-4 outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                    <option>Electricity</option>
                    <option>Maintenance</option>
                    <option>Staff</option>
                    <option>Water</option>
                    <option>Other</option>
                </select>
                </div>
                <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition-all">
                    Save Expense
                </button>
                </div>
            </form>
            </motion.div>
        )}

        {/* Expenses List */}
        <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h4 className="font-bold">Recent Expenses</h4>
            <div className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer">
                <Calendar size={18} />
            </div>
            </div>
            <div className="divide-y divide-slate-700/30">
            {expenses.map((expense) => (
                <div key={expense._id} className="p-4 hover:bg-slate-800/20 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Tag size={20} />
                    </div>
                    <div>
                    <p className="font-bold text-slate-200">{expense.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="bg-slate-700/50 px-2 py-0.5 rounded uppercase font-bold text-[10px]">{expense.category}</span>
                        <span>•</span>
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <span className="text-lg font-bold text-slate-100">₹{expense.amount}</span>
                    <button 
                    onClick={() => deleteExpense(expense._id)}
                    className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                    >
                    <Trash2 size={18} />
                    </button>
                </div>
                </div>
            ))}
            
            {expenses.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-500">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No expenses logged for this month.</p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default ExpenseManager;
    

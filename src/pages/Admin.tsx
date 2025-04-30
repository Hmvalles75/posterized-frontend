import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Search, Filter, X, Eye, ExternalLink, RefreshCcw, Download } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import components as needed
interface Order {
  id: number;
  orderNumber: string;
  status: string;
  purchaseType: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  shippingInfo?: any;
  // Printify fields
  printifyProductType?: string;
  printifySize?: string;
  printifyShopId?: string;
  printifyProductId?: string;
  printifyOrderId?: string;
  printifyShippingCost?: string;
  poster?: {
    id: number;
    style: string;
    previewImagePath: string;
    fullImagePath?: string;
    originalImagePath?: string;
  };
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

interface Stats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalPosters: number;
  };
  orderStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  purchaseTypes: {
    digital: number;
    physical: number;
    bundle: number;
  };
  stylePopularity: Record<string, number>;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<string>('all');
  const [showCharts, setShowCharts] = useState(false);
  
  // Fetch orders once logged in
  const { 
    data: orders, 
    isLoading: isLoadingOrders, 
    refetch: refetchOrders 
  } = useQuery({ 
    queryKey: ['/api/admin/orders'],
    queryFn: async () => {
      try {
        const credentials = btoa(`${username}:${password}`);
        const res = await fetch('/api/admin/orders', {
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        });
        return res.json();
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoggedIn(false);
        toast({
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive'
        });
        throw error;
      }
    },
    enabled: isLoggedIn
  });

  // Fetch stats once logged in
  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useQuery({ 
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      try {
        const credentials = btoa(`${username}:${password}`);
        const res = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        });
        return res.json();
      } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }
    },
    enabled: isLoggedIn
  });
  
  // Function to get specific order details
  const fetchOrderDetails = async (orderId: number) => {
    try {
      const credentials = btoa(`${username}:${password}`);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      const data = await res.json();
      setViewOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch order details',
        variant: 'destructive'
      });
    }
  };
  
  // Function to clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPurchaseTypeFilter('all');
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsLoggedIn(true);
        toast({
          title: 'Login Successful',
          description: 'Welcome to the Admin Dashboard',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: data.message || 'Invalid credentials',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An error occurred during login',
        variant: 'destructive'
      });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const credentials = btoa(`${username}:${password}`);
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: 'Status Updated',
          description: `Order #${data.order.orderNumber} status updated to ${newStatus}`,
        });
        refetchOrders();
      } else {
        toast({
          title: 'Update Failed',
          description: data.message || 'Failed to update order status',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: 'Update Error',
        description: 'An error occurred while updating the status',
        variant: 'destructive'
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Admin Dashboard</h1>
        
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded hover:opacity-90 transition-all"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Admin Dashboard</h1>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
        >
          Log Out
        </button>
      </div>

      {/* Stats Overview */}
      {isLoadingStats ? (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.overview.totalOrders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${stats.overview.totalRevenue.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.overview.totalUsers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Posters</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.overview.totalPosters}</p>
          </div>
        </div>
      ) : null}

      {/* Order Status Distribution */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Pending</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{stats.orderStatus.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Processing</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{stats.orderStatus.processing}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipped</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{stats.orderStatus.shipped}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivered</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{stats.orderStatus.delivered}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Purchase Types</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Digital Downloads</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{stats.purchaseTypes.digital}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Physical Prints</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">{stats.purchaseTypes.physical}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bundle Deals</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{stats.purchaseTypes.bundle}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Toggle */}
      {stats && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowCharts(!showCharts)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-all"
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
            {showCharts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
      
      {/* Visualization Charts */}
      {showCharts && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Status Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pending', value: stats.orderStatus.pending, color: '#FEF3C7' },
                      { name: 'Processing', value: stats.orderStatus.processing, color: '#DBEAFE' },
                      { name: 'Shipped', value: stats.orderStatus.shipped, color: '#E0E7FF' },
                      { name: 'Delivered', value: stats.orderStatus.delivered, color: '#D1FAE5' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Pending', value: stats.orderStatus.pending, color: '#FEF3C7' },
                      { name: 'Processing', value: stats.orderStatus.processing, color: '#DBEAFE' },
                      { name: 'Shipped', value: stats.orderStatus.shipped, color: '#E0E7FF' },
                      { name: 'Delivered', value: stats.orderStatus.delivered, color: '#D1FAE5' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Purchase Type Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Purchase Type Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Digital', value: stats.purchaseTypes.digital },
                    { name: 'Physical', value: stats.purchaseTypes.physical },
                    { name: 'Bundle', value: stats.purchaseTypes.bundle },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Orders" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Style Popularity Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Style Popularity</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(stats.stylePopularity).map(([name, value]) => ({ name, value }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Posters" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Order View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order #{viewOrder.orderNumber}</h2>
                <button 
                  onClick={() => setViewOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${viewOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : viewOrder.status === 'paid' ? 'bg-blue-100 text-blue-800' : viewOrder.status === 'processing' ? 'bg-indigo-100 text-indigo-800' : viewOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' : viewOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : viewOrder.status === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1)}
                      </span>
                    </p>
                    <p><span className="font-medium">Date:</span> {new Date(viewOrder.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium">Total Amount:</span> ${parseFloat(viewOrder.totalAmount).toFixed(2)}</p>
                    <p><span className="font-medium">Purchase Type:</span> {viewOrder.purchaseType.charAt(0).toUpperCase() + viewOrder.purchaseType.slice(1)}</p>
                    {viewOrder.paymentMethod && (
                      <p><span className="font-medium">Payment Method:</span> {viewOrder.paymentMethod}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                  {viewOrder.user ? (
                    <div className="space-y-2">
                      <p><span className="font-medium">Username:</span> {viewOrder.user.username}</p>
                      {viewOrder.user.email && (
                        <p><span className="font-medium">Email:</span> {viewOrder.user.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No customer information available</p>
                  )}
                </div>
              </div>
              
              {/* Poster Information */}
              {viewOrder.poster && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Poster Details</h3>
                  <div className="flex items-start space-x-4">
                    {viewOrder.poster.previewImagePath && (
                      <img 
                        src={`/api/images/previews/${viewOrder.poster.previewImagePath.split('/').pop()}`} 
                        alt="poster preview" 
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    )}
                    <div className="space-y-2">
                      <p><span className="font-medium">Style:</span> {viewOrder.poster.style.charAt(0).toUpperCase() + viewOrder.poster.style.slice(1)}</p>
                      {viewOrder.poster.fullImagePath && (
                        <a 
                          href={`/api/images/full/${viewOrder.poster.fullImagePath.split('/').pop()}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                        >
                          <span>View Full Image</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Printify Information */}
              {(viewOrder.purchaseType === 'physical' || viewOrder.purchaseType === 'bundle') && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Physical Product Details</h3>
                  <div className="space-y-2">
                    {viewOrder.printifyProductType && (
                      <p><span className="font-medium">Product Type:</span> {viewOrder.printifyProductType.charAt(0).toUpperCase() + viewOrder.printifyProductType.slice(1)}</p>
                    )}
                    {viewOrder.printifySize && (
                      <p><span className="font-medium">Size:</span> {viewOrder.printifySize}</p>
                    )}
                    {viewOrder.printifyOrderId && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Printify Order ID:</span> 
                        <span>{viewOrder.printifyOrderId}</span>
                      </div>
                    )}
                    {viewOrder.printifyShippingCost && (
                      <p><span className="font-medium">Shipping Cost:</span> ${parseFloat(viewOrder.printifyShippingCost).toFixed(2)}</p>
                    )}
                    {viewOrder.shippingInfo && (
                      <div>
                        <p className="font-medium mb-1">Shipping Address:</p>
                        <div className="pl-4 border-l-2 border-gray-200">
                          {viewOrder.shippingInfo.name && <p>{viewOrder.shippingInfo.name}</p>}
                          {viewOrder.shippingInfo.address1 && <p>{viewOrder.shippingInfo.address1}</p>}
                          {viewOrder.shippingInfo.address2 && <p>{viewOrder.shippingInfo.address2}</p>}
                          {viewOrder.shippingInfo.city && viewOrder.shippingInfo.zip && (
                            <p>{viewOrder.shippingInfo.city}, {viewOrder.shippingInfo.state} {viewOrder.shippingInfo.zip}</p>
                          )}
                          {viewOrder.shippingInfo.country && <p>{viewOrder.shippingInfo.country}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <button 
                    onClick={() => {
                      setSelectedOrderId(viewOrder.id);
                      setNewStatus(viewOrder.status);
                      setViewOrder(null);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                  >
                    Update Status
                  </button>
                </div>
                <button 
                  onClick={() => setViewOrder(null)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Orders Management</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-4 lg:mt-0">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
            
            {/* Purchase Type Filter */}
            <select
              value={purchaseTypeFilter}
              onChange={(e) => setPurchaseTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
              <option value="bundle">Bundle</option>
            </select>
            
            {/* Clear Filters */}
            {(searchTerm || statusFilter !== 'all' || purchaseTypeFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 flex items-center gap-1"
              >
                <X size={16} />
                Clear
              </button>
            )}
            
            {/* Refresh */}
            <button
              onClick={() => refetchOrders()}
              className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 flex items-center gap-1"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>
        
        {isLoadingOrders ? (
          <div className="flex justify-center my-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !orders || orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poster</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders && orders.filter((order: Order) => {
                  // Apply search term filter
                  const matchesSearch = 
                    searchTerm === '' || 
                    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (order.user?.username && order.user?.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (order.user?.email && order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()));
                  
                  // Apply status filter
                  const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
                  
                  // Apply purchase type filter
                  const matchesPurchaseType = purchaseTypeFilter === 'all' || order.purchaseType === purchaseTypeFilter;
                  
                  return matchesSearch && matchesStatus && matchesPurchaseType;
                }).map((order: Order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user ? order.user.username : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.poster ? (
                        <div className="flex items-center">
                          {order.poster.previewImagePath && (
                            <img 
                              src={`/api/images/previews/${order.poster.previewImagePath.split('/').pop()}`} 
                              alt="poster preview" 
                              className="w-10 h-10 object-cover rounded mr-2"
                            />
                          )}
                          <span>{order.poster.style}</span>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.purchaseType === 'digital' ? 'Digital' : 
                       order.purchaseType === 'physical' ? 'Physical' : 'Bundle'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'canceled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedOrderId === order.id ? (
                        <div className="flex items-center space-x-2">
                          <select 
                            value={newStatus} 
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="">Select status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                          </select>
                          <button 
                            onClick={() => {
                              if (newStatus) {
                                handleStatusUpdate(order.id, newStatus);
                                setSelectedOrderId(null);
                                setNewStatus('');
                              } else {
                                toast({
                                  title: 'Error',
                                  description: 'Please select a status',
                                  variant: 'destructive'
                                });
                              }
                            }}
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOrderId(null);
                              setNewStatus('');
                            }}
                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => fetchOrderDetails(order.id)}
                            className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 flex items-center gap-1"
                          >
                            <Eye size={12} />
                            View Details
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setNewStatus(order.status);
                            }}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                          >
                            <RefreshCcw size={12} />
                            Update Status
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
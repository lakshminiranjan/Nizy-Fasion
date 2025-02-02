import { useEffect, useState } from 'react';
import { PlusCircle, Loader2, Search, Ruler } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import type { Customer } from './types/customer';
import { CustomerModal } from './components/CustomerModal';
import { CustomerList } from './components/CustomerList';

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    shirt: '',
    pants: '',
    phone: '',
  });

  // Check if the screen is mobile/tablet
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
      setFilteredCustomers(data || []);
    } catch (error) {
      toast.error('Error fetching customers');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (customerData: Partial<Customer>) => {
    setLoading(true);

    try {
      if (selectedCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', selectedCustomer.id);

        if (error) throw error;
        toast.success('Customer updated successfully');
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([customerData]);

        if (error) throw error;
        toast.success('Customer added successfully');
      }

      setFormData({ name: '', shirt: '', pants: '', phone: '' });
      setSelectedCustomer(null);
      setIsModalOpen(false);
      await fetchCustomers();
    } catch (error) {
      const errorMessage = selectedCustomer
        ? 'Error updating customer'
        : 'Error adding customer';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      shirt: customer.shirt,
      pants: customer.pants,
      phone: customer.phone,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);

      if (error) throw error;
      toast.success('Customer deleted successfully');
      await fetchCustomers();
    } catch (error) {
      toast.error('Error deleting customer');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      shirt: customer.shirt,
      pants: customer.pants,
      phone: customer.phone,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 text-center">
            {/* <Ruler className="h-8 w-8 text-blue-600" /> */}
            Customer Measurements
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setFormData({ name: '', shirt: '', pants: '', phone: '' });
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredCustomers.length > 0 ? (
              <CustomerList
                customers={filteredCustomers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                isMobile={isMobile}
              />
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No customers found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new customer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomerModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
          setFormData({ name: '', shirt: '', pants: '', phone: '' });
        }}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
}

export default App;

// AddressPage component for address management
import { useAuth } from '../contexts/AuthContext';
import { AddressManager } from '../components';
import { Navigate } from 'react-router-dom';

const AddressPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <AddressManager />
    </div>
  );
};

export default AddressPage;
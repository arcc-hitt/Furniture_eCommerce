// RegisterPage component
// Will be implemented in later tasks

import Layout from '../components/layout/Layout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
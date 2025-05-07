import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  // Update document title
  React.useEffect(() => {
    document.title = "Page Not Found | IQS - Integrated Quality Solutions";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-4xl font-bold font-montserrat text-gray-800 mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
        >
          <MoveLeft className="mr-2" size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
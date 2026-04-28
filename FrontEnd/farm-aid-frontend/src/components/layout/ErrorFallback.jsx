import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-icons-outlined text-5xl text-red-600">error_outline</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        
        <Alert
          type="error"
          title="Error Details"
          className="text-left mb-6"
        >
          <p className="text-sm mt-2">{error.message}</p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs overflow-auto">
              {error.stack}
            </pre>
          )}
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={resetErrorBoundary}
            icon="refresh"
          >
            Try Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            icon="dashboard"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/help')}
            icon="help"
          >
            Get Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
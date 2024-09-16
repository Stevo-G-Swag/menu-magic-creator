import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import CryptoJS from 'crypto-js';

const ErrorLogger = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const { toast } = useToast();
  const isDevelopment = import.meta.env.MODE === 'development';

  const unhashApiKey = (hashedKey) => {
    const secretPassphrase = import.meta.env.VITE_API_KEY_SECRET || "default-secret-passphrase";
    return CryptoJS.AES.decrypt(hashedKey, secretPassphrase).toString(CryptoJS.enc.Utf8);
  };

  const logError = async (error) => {
    console.error('Error logged:', error);
    setErrors(prev => [...prev, { message: error.message, stack: error.stack, timestamp: new Date() }]);

    // Log to backend service
    try {
      const hashedApiKey = import.meta.env.VITE_HASHED_API_KEY || "U2FsdGVkX1+1234567890abcdefghijklmnopqrstuvwxyz=";
      const unhashedApiKey = unhashApiKey(hashedApiKey);

      await fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': unhashedApiKey,
        },
        body: JSON.stringify({ error: { message: error.message, stack: error.stack } }),
      });
    } catch (logError) {
      console.error('Failed to log error to backend:', logError);
    }
  };

  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      logError(new Error(args.join(' ')));
      originalConsoleError.apply(console, args);
    };

    const handleError = (event) => {
      logError(event.error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => handleError(new Error(event.reason)));

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  useEffect(() => {
    if (errors.length > 0 && isDevelopment) {
      toast({
        title: "New Error Detected (Dev Mode)",
        description: errors[errors.length - 1].message,
        variant: "destructive",
      });
    }
  }, [errors, isDevelopment, toast]);

  return (
    <div>
      {children}
      {isDevelopment && errors.length > 0 && (
        <div className="fixed bottom-0 right-0 m-4 p-4 bg-red-100 border border-red-400 rounded max-w-md max-h-64 overflow-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Log (Dev Mode):</h3>
          {errors.map((error, index) => (
            <div key={index} className="mb-2 text-sm text-red-600">
              <p><strong>Timestamp:</strong> {error.timestamp.toLocaleString()}</p>
              <p><strong>Message:</strong> {error.message}</p>
              {error.stack && (
                <details>
                  <summary>Stack Trace</summary>
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorLogger;

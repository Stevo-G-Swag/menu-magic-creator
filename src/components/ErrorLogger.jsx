import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import CryptoJS from 'crypto-js';

const ErrorLogger = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const { toast } = useToast();
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const unhashApiKey = (hashedKey) => {
    const secretPassphrase = process.env.REACT_APP_API_KEY_SECRET || "default-secret-passphrase";
    return CryptoJS.AES.decrypt(hashedKey, secretPassphrase).toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      setErrors(prev => [...prev, { message: args.join(' '), timestamp: new Date() }]);
      originalConsoleError.apply(console, args);
    };

    const handleError = (event) => {
      setErrors(prev => [...prev, { message: event.error.message, stack: event.error.stack, timestamp: new Date() }]);
    };

    window.addEventListener('error', handleError);

    const intervalId = setInterval(async () => {
      if (errors.length === 0) return;

      try {
        const hashedApiKey = process.env.REACT_APP_HASHED_API_KEY || "U2FsdGVkX1+1234567890abcdefghijklmnopqrstuvwxyz=";
        const unhashedApiKey = unhashApiKey(hashedApiKey);

        const response = await fetch('/api/scan-for-errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': unhashedApiKey,
          },
          body: JSON.stringify({ errors }),
        });
        const data = await response.json();
        if (data.newErrors && data.newErrors.length > 0) {
          data.newErrors.forEach(error => {
            toast({
              title: isDevelopment ? "New Error Detected (Dev Mode)" : "An issue occurred",
              description: isDevelopment ? error.message : "We're working on it.",
              variant: "destructive",
            });
          });
        }
        setErrors([]);
      } catch (error) {
        console.error('Error scanning for errors:', error);
      }
    }, isDevelopment ? 10000 : 30000);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
      clearInterval(intervalId);
    };
  }, [toast, errors]);

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
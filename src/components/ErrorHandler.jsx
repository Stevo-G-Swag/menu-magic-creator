import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ErrorHandler = () => {
  const [errorDetails, setErrorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const error = location.state?.error;

  useEffect(() => {
    const fetchErrorAnalysis = async () => {
      try {
        const response = await fetch('/api/analyze-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error }),
        });
        if (!response.ok) throw new Error('Failed to fetch error analysis');
        const data = await response.json();
        setErrorDetails(data);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setErrorDetails({ message: 'Failed to analyze error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    if (error) {
      fetchErrorAnalysis();
    } else {
      setIsLoading(false);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Error Details</CardTitle>
        </CardHeader>
        <CardContent>
          {errorDetails ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Error Message:</h2>
              <p className="mb-4">{errorDetails.message}</p>
              {errorDetails.affectedFiles && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Affected Files:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {errorDetails.affectedFiles.map((file, index) => (
                      <li key={index}>{file}</li>
                    ))}
                  </ul>
                </>
              )}
              {errorDetails.possibleSolution && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Possible Solution:</h3>
                  <p>{errorDetails.possibleSolution}</p>
                </>
              )}
            </>
          ) : (
            <p>No error details available.</p>
          )}
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorHandler;
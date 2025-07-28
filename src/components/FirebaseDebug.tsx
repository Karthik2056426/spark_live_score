import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AlertCircle, CheckCircle, Database, RefreshCw } from 'lucide-react';

const FirebaseDebug: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [collections, setCollections] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkFirebaseConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('checking');
    
    try {
      // Test basic connection
      const housesRef = collection(db, 'houses');
      const snapshot = await getDocs(housesRef);
      
      // Get all collections
      const collectionsData = [
        { name: 'houses', ref: collection(db, 'houses') },
        { name: 'events', ref: collection(db, 'events') },
        { name: 'winners', ref: collection(db, 'winners') },
        { name: 'eventTemplates', ref: collection(db, 'eventTemplates') }
      ];

      const collectionsInfo = await Promise.all(
        collectionsData.map(async ({ name, ref }) => {
          const snap = await getDocs(ref);
          return { name, count: snap.size };
        })
      );

      setCollections(collectionsInfo);
      setConnectionStatus('connected');
      setErrorMessage('');
    } catch (error) {
      console.error('Firebase connection error:', error);
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Firebase Connection Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {connectionStatus === 'checking' && (
            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          )}
          {connectionStatus === 'connected' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {connectionStatus === 'error' && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="font-medium">
            {connectionStatus === 'checking' && 'Checking connection...'}
            {connectionStatus === 'connected' && 'Connected to Firebase'}
            {connectionStatus === 'error' && 'Connection failed'}
          </span>
        </div>

        {/* Error Message */}
        {connectionStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Collections Info */}
        {connectionStatus === 'connected' && (
          <div>
            <h4 className="font-medium mb-2">Database Collections:</h4>
            <div className="grid grid-cols-2 gap-2">
              {collections.map(({ name, count }) => (
                <div key={name} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                  <span className="text-sm font-medium">{name}</span>
                  <Badge variant="outline">{count} documents</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <Button 
          onClick={checkFirebaseConnection} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Connection
            </>
          )}
        </Button>

        {/* Configuration Help */}
        {connectionStatus === 'error' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>To fix this issue:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create a <code>.env</code> file in your project root</li>
                  <li>Add your Firebase configuration variables</li>
                  <li>Add the same variables to your Vercel environment settings</li>
                  <li>Redeploy your application</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FirebaseDebug; 
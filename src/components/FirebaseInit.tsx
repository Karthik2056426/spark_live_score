import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeFirebase } from '@/lib/init-firebase';
import { useSparkData } from '@/hooks/useSparkData';
import { useToast } from '@/hooks/use-toast';
import { Database, Loader2 } from 'lucide-react';

const FirebaseInit: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { houses, events, winners, eventTemplates, loading } = useSparkData();
  const { toast } = useToast();

  // Only show if database is empty and not loading
  const shouldShow = !loading && houses.length === 0 && events.length === 0 && 
                   winners.length === 0 && eventTemplates.length === 0 && !isInitialized;

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeFirebase();
      setIsInitialized(true);
      toast({
        title: "Database Initialized!",
        description: "Firebase database has been set up with initial data.",
        variant: "default"
      });
    } catch (error) {
      console.error('Initialization error:', error);
      toast({
        title: "Initialization Failed",
        description: "There was an error setting up the database. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Don't render if database is already populated or if we've initialized
  if (!shouldShow) {
    return null;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Initialize Firebase Database</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will populate your Firebase database with initial data including houses, events, winners, and event templates.
        </p>
        <Button 
          onClick={handleInitialize} 
          disabled={isInitializing}
          className="w-full"
        >
          {isInitializing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Initialize Database
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FirebaseInit; 
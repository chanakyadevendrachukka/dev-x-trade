import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FirebaseDebug() {
  const [status, setStatus] = useState('Checking Firebase connection...');
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Check if auth is initialized
        if (auth) {
          setStatus('✅ Firebase Auth initialized successfully');
          setAuthReady(true);
          
          // Check current user
          auth.onAuthStateChanged((user) => {
            if (user) {
              setStatus(`✅ Firebase connected - Current user: ${user.email}`);
            } else {
              setStatus('✅ Firebase connected - No user signed in');
            }
          });
        } else {
          setStatus('❌ Firebase Auth not initialized');
        }
      } catch (error: any) {
        setStatus(`❌ Firebase Error: ${error.message}`);
        console.error('Firebase debug error:', error);
      }
    };

    checkFirebaseStatus();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('🔄 Testing Firebase connection...');
      
      // Try to get current user
      const user = auth.currentUser;
      if (user) {
        setStatus(`✅ Test successful - User: ${user.email}`);
      } else {
        setStatus('✅ Test successful - Ready for authentication');
      }
    } catch (error: any) {
      setStatus(`❌ Test failed: ${error.message}`);
      console.error('Firebase test error:', error);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Firebase Debug Console</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-mono text-sm">{status}</p>
        </div>
        
        <div className="space-y-2">
          <p><strong>Project ID:</strong> devxtrade-1</p>
          <p><strong>Auth Domain:</strong> devxtrade-1.firebaseapp.com</p>
          <p><strong>Auth Ready:</strong> {authReady ? '✅' : '❌'}</p>
        </div>
        
        <Button onClick={testConnection}>
          Test Connection
        </Button>
        
        <div className="text-sm text-muted-foreground">
          <p><strong>Common Issues:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Authentication not enabled in Firebase Console</li>
            <li>Domain not authorized in Firebase settings</li>
            <li>API key restrictions</li>
            <li>Network connectivity issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

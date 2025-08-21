import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home, ArrowLeft, Wallet } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <Wallet className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
              <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              Need help? Contact our{' '}
              <Button variant="link" className="p-0 h-auto text-xs">
                support team
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
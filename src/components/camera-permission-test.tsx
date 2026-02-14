'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraOff } from 'lucide-react';
import { Button } from './ui/button';

export function CameraPermissionTest() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Clean up the stream when the component unmounts
        return () => {
          stream.getTracks().forEach(track => track.stop());
        };
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
  }, [toast]); // Add toast to dependency array

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Webcam Access Demo</CardTitle>
        <CardDescription>
          This component demonstrates how a Progressive Web App requests camera permissions at runtime.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-black rounded-md flex items-center justify-center overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        </div>
        
        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <CameraOff className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              To use video features, please allow camera access in your browser's site settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {hasCameraPermission === true && (
            <Alert>
                <AlertTitle>Permission Granted!</AlertTitle>
                <AlertDescription>
                    Your camera feed is being displayed above. This demonstrates a successful permission request.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}

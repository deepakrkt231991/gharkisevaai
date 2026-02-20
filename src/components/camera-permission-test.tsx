'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, VideoOff } from 'lucide-react';

export function CameraPermissionTest() {
  const [permissionStatus, setPermissionStatus] = useState<'loading' | 'granted' | 'denied' | 'unsupported'>('loading');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      // Check if mediaDevices API is available (Desktop Fallback)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionStatus('unsupported');
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionStatus('granted');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (error) {
        console.error('Error accessing camera:', error);
        setPermissionStatus('denied');
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop the stream when component unmounts
    return () => {
        stream?.getTracks().forEach(track => track.stop());
    };
  }, [toast]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Webcam Access Demo</CardTitle>
        <CardDescription>
          This component demonstrates how a Progressive Web App requests and handles camera permissions at runtime. This works in mobile browsers and provides a fallback for desktops without a camera.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-black rounded-md flex items-center justify-center overflow-hidden text-muted-foreground">
          {permissionStatus !== 'unsupported' ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          ) : (
             <div className="text-center p-4">
                <VideoOff className="w-12 h-12 mx-auto" />
                <p className="mt-2 font-semibold">Camera Not Supported</p>
                <p className="text-sm">Your browser does not support this feature.</p>
             </div>
          )}
        </div>
        
        {permissionStatus === 'denied' && (
          <Alert variant="destructive">
            <CameraOff className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              To use video features, please allow camera access in your browser's site settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {permissionStatus === 'granted' && (
            <Alert>
                <Camera className="h-4 w-4" />
                <AlertTitle>Permission Granted!</AlertTitle>
                <AlertDescription>
                    Your camera feed is being displayed above. This demonstrates a successful permission request.
                </AlertDescription>
            </Alert>
        )}

        {permissionStatus === 'unsupported' && (
             <Alert variant="destructive">
                <VideoOff className="h-4 w-4" />
                <AlertTitle>Feature Not Available</AlertTitle>
                <AlertDescription>
                    We could not access a camera. This might be because you're on a desktop without a webcam, or your browser doesn't support this feature.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}

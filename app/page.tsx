"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSecret() {
      try {
        const res = await fetch('/api/secret');
        if (!res.ok) throw new Error('Failed to fetch secret');
        const data = await res.json();
        setSecret(data.secret || 'No secret found');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchSecret();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white space-y-8">
      {/* Secret Demo Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg rounded-2xl border">
          <CardHeader>
            <CardTitle className="text-2xl">Kubernetes Secrets Demo</CardTitle>
            <CardDescription>Securely display your environment secret</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : error ? (
              <p className="text-center text-red-600 font-medium">{error}</p>
            ) : (
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  Secret Value
                </Badge>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="break-words text-center font-mono text-lg text-blue-600"
                >
                  {secret}
                </motion.p>
                <Separator />
                <div className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="sm">
                        Copy to Clipboard
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy secret</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-4 border-t flex justify-end"
          >
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* Horizontal Layout for Steps and Manifests */}
      <div className="flex flex-col lg:flex-row lg:space-x-6 w-full max-w-4xl">
        {/* Steps Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Setup Steps</CardTitle>
            <CardDescription>Follow these steps to deploy on Kubernetes</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Create your Docker image and push to registry</li>
              <li>Apply <code>secret.yaml</code> to create Kubernetes Secret</li>
              <li>Deploy application with <code>deployment.yaml</code></li>
              <li>Expose service via <code>service.yaml</code> (NodePort)</li>
              <li>Fetch Minikube IP and NodePort, then visit URL</li>
            </ol>
          </CardContent>
        </Card>

        {/* Manifests Card */}
        <Card className="flex-1 shadow-sm">
          <CardHeader>
            <CardTitle>Kubernetes Manifests</CardTitle>
            <CardDescription>YAML definitions for Secret, Deployment, and Service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Secret YAML */}
            <div>
              <h3 className="text-lg font-medium mb-2">secret.yaml</h3>
              <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                <code>{`apiVersion: v1
kind: Secret
metadata:
  name: my-secrets
type: Opaque
data:
  username: ZHVtbXl1c2Vy
  password: ZHVtbXlwYXNzd29yZA==`}</code>
              </pre>
            </div>
            {/* Deployment YAML */}
            <div>
              <h3 className="text-lg font-medium mb-2">deployment.yaml</h3>
              <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                <code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nextjs-app
  template:
    metadata:
      labels:
        app: nextjs-app
    spec:
      containers:
      - name: nextjs-container
        image: your-dockerhub-username/nextjs-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: SECRET_USERNAME
          valueFrom:
            secretKeyRef:
              name: my-secrets
              key: username
        - name: SECRET_PASSWORD
          valueFrom:
            secretKeyRef:
              name: my-secrets
              key: password`}</code>
              </pre>
            </div>
            {/* Service YAML */}
            <div>
              <h3 className="text-lg font-medium mb-2">service.yaml</h3>
              <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
                <code>{`apiVersion: v1
kind: Service
metadata:
  name: nextjs-service
spec:
  selector:
    app: nextjs-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: NodePort`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

# Next.js + Kubernetes Secrets and ConfigMap Demo

A clean and polished **Next.js** application demonstrating how to use **Kubernetes Secrets** and **ConfigMaps** as **environment variables** inside a pod.

This project showcases:
- Accessing public config values (from ConfigMap)
- Accessing private secrets (from Kubernetes Secret)
- Clean UI using **shadcn/ui** components
- Displaying YAML manifest files and setup instructions within the app

---

## ✨ Features
- **Next.js 14** (App Router, Server Components)
- **shadcn/ui** for UI components
- Secrets fetched securely from an API route (`/api/secret`)
- ConfigMaps exposed as public environment variables
- Clean layout with responsive design

---

## 🔧 Local Development Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run locally with environment variables:**

```bash
SECRET_USERNAME=dummyuser SECRET_PASSWORD=dummypass npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy to Kubernetes

### Step 1: Build and Push Docker Image

```bash
docker build -t your-dockerhub-username/env-demo:latest .
docker push your-dockerhub-username/env-demo:latest
```

### Step 2: Create Kubernetes Resources

Apply the following YAML manifests:

- **ConfigMap**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NEXT_PUBLIC_APP_NAME: "K8s Env Demo"
  NEXT_PUBLIC_API_URL: "http://app-service/api"
  NEXT_PUBLIC_THEME: "light"
  LOG_LEVEL: "info"
  CACHE_TTL: "3600"
```

- **Secret**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DATABASE_URL: <base64-encoded>
  API_KEY: <base64-encoded>
  JWT_SECRET: <base64-encoded>
```

- **Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: env-demo
  template:
    metadata:
      labels:
        app: env-demo
    spec:
      containers:
      - name: nextjs
        image: your-dockerhub-username/env-demo:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_APP_NAME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NEXT_PUBLIC_APP_NAME
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NEXT_PUBLIC_API_URL
        - name: NEXT_PUBLIC_THEME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NEXT_PUBLIC_THEME
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_URL
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: API_KEY
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
```

- **Service**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: env-demo
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: NodePort
```

### Step 3: Apply all YAMLs

```bash
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### Step 4: Access the App

- Find the NodePort:

```bash
kubectl get svc app-service
```

- Open `http://<NodeIP>:<NodePort>` in the browser.

---

## 🛍️ Author
- Built with ❤️ by [Your Name]

---

## 📈 Future Improvements
- Add Health Check APIs
- Use Kubernetes Ingress instead of NodePort
- Add automatic base64 encoding scripts for secrets
- CI/CD pipeline using GitHub Actions

---

## 🎉 License

This project is licensed under the MIT License.


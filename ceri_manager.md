Installing Cert-Manager:
$ helm repo add jetstack https://charts.jetstack.io
$ helm repo update

Install Cert-Manager with CRDs into your cluster:
$ helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true

To verify your cert-manager is up and running, use the below command:
kubectl get pods -n cert-manager

Jetstack also offers a kubectl plugin to easily manage cert-manager resources in your cluster
$ curl -L -o kubectl-cert-manager.tar.gz https://github.com/jetstack/cert-manager/releases/download/v1.6.1/kubectl-cert_manager-darwin-amd64.tar.gz
$ tar xzf kubectl-cert-manager.tar.gz
$ sudo mv kubectl-cert_manager /usr/local/bin

I recommend you install cmctl for a better experience via tab auto-completion:
$ curl -L -o cmctl-darwin-amd64.tar.gz https://github.com/jetstack/cert-manager/releases/download/v1.6.1/cmctl-darwin-amd64.tar.gz
$ tar xzf cmctl-darwin-amd64.tar.gz
$ sudo mv cmctl /usr/local/bin

$ kubectl cert-manager help

For the rest of this tutorial, you will also need to install the Nginx ingress controller:
$ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
$ helm repo update
$ helm install ingress-controller ingress-nginx/ingress-nginx

clusterissuer

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: example@domain.com
    privateKeySecretRef:
      name: letsencrypt-production
    solvers:
      - http01:
          ingress:
            class: nginx
```

Next, we will create a manifest yaml certificate.yaml for the certificate.
Certificate

```
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: staging
  namespace: default
spec:
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  secretName: cert-testing
  dnsNames:
  - blog.domain.com
```

Deployment

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wordpress
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      containers:
        - name: wordpress
          image: wordpress:latest
          ports:
            - containerPort: 80
            class: nginx
```

Service

```
---
apiVersion: v1
kind: Service
metadata:
  name: wordpress
spec:
  selector:
    app: wordpress
  ports:
    - protocol: TCP
      port: 80
```

Service

```
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wordpress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-production
    nginx.ingress.kubernetes.io/rewrite-target: /

spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: wordpress
                port:
                  number: 80
  tls:
  - hosts:
    - "blog.domain.com"
    secretName: cert-testing
```

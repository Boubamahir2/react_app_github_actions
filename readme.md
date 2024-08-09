# react_app_github_actions

# DevOpsify the go web application

The main goal of this project is to implement DevOps practices in the Go web application. The project is a simple website written in Golang. It uses the `net/http` package to serve HTTP requests.

DevOps practices include the following:

- Creating Dockerfile (Multi-stage build)
- Containerization
- Continuous Integration (CI)
- Continuous Deployment (CD)

## Summary Diagram
![image](https://github.com/user-attachments/assets/45f4ef12-c5b5-4247-9d43-356b5dfb671b)


## Creating Dockerfile (Multi-stage build)
The Dockerfile is used to build a Docker image. The Docker image contains the Go web application and its dependencies. The Docker image is then used to create a Docker container.

We will use a Multi-stage build to create the Docker image. The Multi-stage build is a feature of Docker that allows you to use multiple build stages in a single Dockerfile. This will reduce the size of the final Docker image and also secure the image by removing unnecessary files and packages.

## Containerization
Containerization is the process of packaging an application and its dependencies into a container. The container is then run on a container platform such as Docker. Containerization allows you to run the application in a consistent environment, regardless of the underlying infrastructure.

We will use Docker to containerize the Go web application. Docker is a container platform that allows you to build, ship, and run containers.

Commands to build the Docker container:

```bash
docker build -t <your-docker-username>/go-web-app .
```

Command to run the Docker container:

```bash
docker run -p 3000:3000 <your-docker-username>/go-web-app
```

Command to push the Docker container to Docker Hub:

```bash
docker push <your-docker-username>/go-web-app
```

### create k8s cluster
- create folder called manifest then cd into manifest
- create deployement.yaml
```bash
  # This is a sample deployment manifest file for a simple web application.
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: go-web-app
    labels:
      app: go-web-app
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: go-web-app
    template:
      metadata:
        labels:
          app: go-web-app
      spec:
        containers:
        - name: go-web-app
          image: <docker-user-name>/go-web-app:latest
        ports:
        - containerPort: 8080
```

- create service.yaml
```bash
# This is a sample service manifest file for a simple web application.
# Service for the application
apiVersion: v1
kind: Service
metadata:
  name: go-web-app
  labels:
    app: go-web-app
spec:
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  selector:
    app: go-web-app
  type: ClusterIP
```

- create ingress.yaml
```bash
# This is a sample ingress manifest file for a simple web application.
# Ingress resource for the application
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-web-app
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: go-web-app.local
    http:
      paths: 
      - path: /
        pathType: Prefix
        backend:
          service:
            name: go-web-app
            port:
              number: 80
```


### install helm From Script
```
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

### install helm From Apt (Debian/Ubuntu)
```
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## Create helm app 
- create helm folder in the project directory
- cd helm
- helm create <your-app-chart>
- cd your-app-chart
- rm -rf charts
- cd templates and delete all the files
- rm -rf *
- cp ../../../k8s/manifests/* . copy all the manifests file from k8s


 ### paste the following code in Values.yaml in the helm app
```
# Default values for go-web-app-chart.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

image:
  repository: boubamahir/react-app-github_actions
  pullPolicy: IfNotPresent
  # Overrides the image tag whose default is the chart appVersion.
  tag: "10016307834"

ingress:
  enabled: false
  className: ""
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific
```

### create ingress-controller

1. Run the kubectl command to create a namespace:
```
kubectl create namespace ingress-nginx
```
2. Run the command to add the helm repository for the nginx Controller:
```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```
3. Run the command to update the helm repository data:
```
helm repo update
```
4. Run the command to install the Controller: in helm app

```
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace -f values.yaml

```
You have installed the nginx Ingress Controller. It will now automatically create a Load Balancer on your behalf.

5. Use this command to get the IP address:
```
watch kubectl -n ingress-nginx get svc
```

## cd helm to installfrom app helm folder 
- cd helm 
- ls 
```
helm install <your-app> ./<your-app-chart>
```
i.e helm install react-app-new ./react-app-chart

### check if app running
- kubectl get deployment
- kubectl get svc
- kubectl get ing

## Continuous Integration (CI)
Continuous Integration (CI) is the practice of automating the integration of code changes into a shared repository. CI helps to catch bugs early in the development process and ensures that the code is always in a deployable state.

We will use GitHub Actions to implement CI for the Go web application. GitHub Actions is a feature of GitHub that allows you to automate workflows, such as building, testing, and deploying code.

The GitHub Actions workflow will run the following steps:
- Checkout the code from the repository
- Build the Docker image
- Run the Docker container
- Run tests

### steps in setting github actions
- create a folder .github/workfows
- create a file ci.yaml
- go to github , then settings 
- got actions , then got secrets and variables 
- create github TOKEN for secret.TOKEN
- create DOCKERHUB_USERNAME and DOCKERHUB_TOKEN variables
- got to docker hub , then Account settings-> click personal access token and generate new token, copy and paste it into DOCKERHUB_TOKEN field  
- you can visit github market place for pipeline syntanx

## Minikube tunnel

### How to use NodePort:
Edit your service:
```
kubectl edit svc react-app-github-actions
```
### Change the type to NodePort:
type: NodePort

## Using minikube tunnel
Start the tunnel:
```
minikube tunnel
```

### Access your service:
You can access your service using the following command:
```
minikube service <service-name> --url
```
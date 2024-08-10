# !/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status
sudo apt update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade  -y

sudo snap install kubectl

### Kubeconfig
#download the Kubeconfig from digitalocean manuel setup
sudo cp ./k8s-cluster-kubeconfig.yaml $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
echo "--------------------connected successfully--------------------"


### install helm From Apt (Debian/Ubuntu)
echo "--------------------helm--------------------"
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update  -y
sudo apt-get install helm  -y
echo "--------------------helm--------------------"


### create ingress-controller
#Run the kubectl command to create a namespace:
kubectl create namespace ingress-nginx
#Run the command to add the helm repository for the nginx Controller:
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
#Run the command to update the helm repository data:
helm repo update

#4. Run the command to install the Controller: in helm app
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace -f helm/react-app-chart/values.yaml



## ArgoCD
### Install Argo CD using manifests
echo "--------------------argocd--------------------"
create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
## ArgoCD password
echo "--------------------Argocd password--------------------"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d



#Steps to Install Prometheus:
echo "--------------------Prometheus--------------------"

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update 
helm install prometheus prometheus-community/prometheus
kubectl expose service prometheus-server --type=NodePort --target-port=9090 --name=prometheus-server-ext
minikube service prometheus-server-ext
echo "prometheus installed and started successfully!"
# Prometheus password
echo "--------------------Prometheus password--------------------"
kubectl get secret --namespace default prometheus -o jsonpath="{.data.admin-password}" | base64 --decode ; echo


#Steps to install Grafana:
echo "--------------------Grafana--------------------"

helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install grafana stable/grafana
kubectl expose service grafana --type=NodePort --target-port=3000 --name=grafana-ext
minikube service grafana-ext
echo "granfana installed and started successfully!"

# To get user name and password in Grafana:

# kubectl get secret --namespace default grafana -o yaml
# echo "RkpwY21aTFNXRDVJN3Z4RWFFUjlibkV1SDBDbnFBendadmc0bmROZQ==" | openssl base64 -d ; echo

# or 
echo "--------------------Grafana password--------------------"
kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo


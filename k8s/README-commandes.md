# 📋 Commandes kubectl — TPs Kubernetes (4.1 → 4.13)

> **Prérequis** : Minikube démarré (`minikube start`) et kubectl configuré.  
> Docker Hub : `mbargaernest` | Image portfolio : `mbargaernest/mbarga-portfolio`

---

## TP 4.1 — Découverte de Minikube

```bash
# Démarrer Minikube
minikube start

# Vérifier le statut du cluster
minikube status

# Infos sur le cluster
kubectl cluster-info

# Lister les nœuds
kubectl get nodes

# Lister les nœuds avec plus de détails
kubectl get nodes -o wide

# Ouvrir le dashboard Minikube
minikube dashboard

# Arrêter Minikube
minikube stop
```

**Résultats attendus** :
- `minikube status` → `host: Running`, `kubelet: Running`, `apiserver: Running`
- `kubectl get nodes` → 1 nœud `minikube` en état `Ready`

---

## TP 4.2 — Pods

```bash
# Créer le pod simple
kubectl apply -f tp42/pod.yaml

# Vérifier que le pod est Running
kubectl get pods

# Détails complets du pod
kubectl describe pod my-pod

# Accéder aux logs du pod
kubectl logs my-pod

# Exécuter une commande dans le pod
kubectl exec -it my-pod -- sh

# Créer le pod sidecar
kubectl apply -f tp42/pod-sidecar.yaml

# Vérifier les 2 conteneurs du pod sidecar
kubectl get pod web-sidecar

# Logs du conteneur web dans le sidecar
kubectl logs web-sidecar -c web

# Logs du conteneur générateur
kubectl logs web-sidecar -c generateur

# Port-forward pour tester le pod sidecar (ouvrir http://localhost:8080)
kubectl port-forward pod/web-sidecar 8080:80

# Supprimer les pods
kubectl delete pod my-pod
kubectl delete pod web-sidecar
```

**Résultats attendus** :
- `kubectl get pods` → `my-pod` et `web-sidecar` en état `Running`
- `kubectl port-forward` + `curl localhost:8080` → la date actuelle s'affiche (mise à jour toutes les 5s)

---

## TP 4.3 — Deployment + Service

```bash
# Créer le Deployment (3 replicas nginx)
kubectl apply -f tp43/deployment.yaml

# Créer le Service NodePort
kubectl apply -f tp43/service.yaml

# Lister les deployments
kubectl get deployments

# Lister les pods créés par le deployment
kubectl get pods -l app=myapp

# Lister les services
kubectl get services

# Détails du deployment
kubectl describe deployment nginx-deployment

# Tester le service via Minikube
minikube service nginx-service --url

# Accéder via NodePort (IP Minikube)
curl $(minikube ip):30080

# Scaler le deployment à 5 replicas
kubectl scale deployment nginx-deployment --replicas=5

# Vérifier le scaling
kubectl get pods -l app=myapp

# Revenir à 3 replicas
kubectl scale deployment nginx-deployment --replicas=3

# Supprimer
kubectl delete -f tp43/deployment.yaml
kubectl delete -f tp43/service.yaml
```

**Résultats attendus** :
- `kubectl get deployments` → `nginx-deployment` avec `READY 3/3`
- `curl $(minikube ip):30080` → page d'accueil nginx

---

## TP 4.4 — Webapp fil rouge (portfolio + redis)

```bash
# Déployer Redis
kubectl apply -f tp44/redis-deployment.yaml
kubectl apply -f tp44/redis-service.yaml

# Déployer la webapp
kubectl apply -f tp44/webapp-deployment.yaml
kubectl apply -f tp44/webapp-service.yaml

# Vérifier tous les pods
kubectl get pods

# Vérifier les services
kubectl get services

# Tester l'URL de la webapp
minikube service webapp-service --url

# Accéder via NodePort
curl $(minikube ip):30300

# Logs de la webapp
kubectl logs -l app=webapp

# Logs de redis
kubectl logs -l app=redis

# Supprimer tout
kubectl delete -f tp44/
```

**Résultats attendus** :
- `kubectl get pods` → 1 pod redis + 2 pods webapp en `Running`
- `curl $(minikube ip):30300` → page du portfolio

---

## TP 4.5 — WordPress + MySQL

```bash
# Appliquer dans l'ordre : secret → PVC → deployments → services
kubectl apply -f tp45/mysql-secret.yaml
kubectl apply -f tp45/mysql-pvc.yaml
kubectl apply -f tp45/wordpress-pvc.yaml
kubectl apply -f tp45/mysql-deployment.yaml
kubectl apply -f tp45/mysql-service.yaml
kubectl apply -f tp45/wordpress-deployment.yaml
kubectl apply -f tp45/wordpress-service.yaml

# Vérifier les PVC (doivent être Bound)
kubectl get pvc

# Vérifier les pods
kubectl get pods

# Vérifier les secrets
kubectl get secrets
kubectl describe secret mysql-secret

# Accéder à WordPress
minikube service wordpress-service --url
# Ou directement : http://$(minikube ip):30800

# Supprimer tout
kubectl delete -f tp45/
```

**Résultats attendus** :
- `kubectl get pvc` → `mysql-pvc` et `wordpress-pvc` en état `Bound`
- `kubectl get pods` → 1 pod mysql + 1 pod wordpress en `Running`
- Navigateur sur `$(minikube ip):30800` → assistant d'installation WordPress

---

## TP 4.6 — Jobs et CronJobs

```bash
# Créer le Job
kubectl apply -f tp46/job.yaml

# Suivre l'exécution du Job
kubectl get jobs
kubectl get pods -l job-name=batch-job

# Voir les logs du Job
kubectl logs -l job-name=batch-job

# Résultat attendu dans les logs :
# Tâche terminée
# Date : <date actuelle>

# Créer le CronJob (s'exécute toutes les minutes)
kubectl apply -f tp46/cronjob.yaml

# Vérifier le CronJob
kubectl get cronjobs

# Attendre 1 minute puis vérifier les jobs créés
kubectl get jobs

# Logs du dernier job du CronJob
kubectl logs -l job-name=$(kubectl get jobs --sort-by=.status.startTime -o name | tail -1 | cut -d/ -f2)

# Créer le DaemonSet
kubectl apply -f tp46/daemonset.yaml

# Vérifier le DaemonSet (1 pod par nœud)
kubectl get daemonsets
kubectl get pods -l app=monitoring

# Supprimer tout
kubectl delete -f tp46/
```

**Résultats attendus** :
- `kubectl get jobs` → `batch-job` avec `COMPLETIONS 1/1`
- `kubectl get cronjobs` → `date-cronjob` avec `SCHEDULE */1 * * * *`
- `kubectl get daemonsets` → `monitoring-daemonset` avec `DESIRED 1`

---

## TP 4.7 — Namespaces, ConfigMaps, Secrets

```bash
# Créer le namespace production
kubectl apply -f tp47/namespace.yaml

# Vérifier le namespace
kubectl get namespaces

# Créer ConfigMap et Secret dans ce namespace
kubectl apply -f tp47/configmap.yaml
kubectl apply -f tp47/secret.yaml

# Vérifier
kubectl get configmap -n production
kubectl describe configmap app-config -n production

kubectl get secret -n production
kubectl describe secret app-secret -n production

# Décoder un secret
kubectl get secret app-secret -n production -o jsonpath='{.data.REDIS_PASSWORD}' | base64 --decode

# Déployer l'application avec config
kubectl apply -f tp47/deployment-with-config.yaml

# Vérifier les pods dans le namespace production
kubectl get pods -n production

# Vérifier les variables d'environnement injectées
kubectl exec -n production \
  $(kubectl get pod -n production -l app=portfolio -o name | head -1) \
  -- env | grep -E "APP_ENV|APP_COLOR|PORT|REDIS"

# Supprimer tout
kubectl delete -f tp47/
kubectl delete namespace production
```

**Résultats attendus** :
- `kubectl get namespaces` → `production` en état `Active`
- Variables d'env dans le pod → `APP_ENV=production`, `PORT=3000`, `REDIS_PASSWORD=Nash@2006`

---

## TP 4.8 — Scaling, RollingUpdate, Rollback

```bash
# Déployer la version 1
kubectl apply -f tp48/deployment-v1.yaml

# Vérifier que les 3 replicas sont Running
kubectl get pods -l app=portfolio

# Voir la stratégie de déploiement
kubectl describe deployment portfolio-deployment | grep -A5 "RollingUpdateStrategy"

# Mettre à jour vers la version 2 (rolling update)
kubectl apply -f tp48/deployment-v2.yaml

# Suivre le rolling update en temps réel
kubectl rollout status deployment/portfolio-deployment

# Voir l'historique des révisions
kubectl rollout history deployment/portfolio-deployment

# Voir les détails de la révision 1
kubectl rollout history deployment/portfolio-deployment --revision=1

# Rollback vers la version précédente
kubectl rollout undo deployment/portfolio-deployment

# Vérifier le rollback
kubectl rollout status deployment/portfolio-deployment
kubectl get pods -l app=portfolio

# Rollback vers une révision spécifique
kubectl rollout undo deployment/portfolio-deployment --to-revision=1

# Scaler manuellement
kubectl scale deployment portfolio-deployment --replicas=5
kubectl get pods -l app=portfolio

# Supprimer
kubectl delete deployment portfolio-deployment
```

**Résultats attendus** :
- Rolling update → pods remplacés un par un sans downtime
- `kubectl rollout undo` → retour automatique à l'image précédente
- `kubectl rollout history` → au moins 2 révisions listées

---

## TP 4.9 — Probes et ressources

```bash
# Déployer avec probes et ressources
kubectl apply -f tp49/deployment-probes.yaml

# Vérifier les pods
kubectl get pods -l app=portfolio

# Voir les détails des probes
kubectl describe pod -l app=portfolio | grep -A10 "Liveness\|Readiness"

# Voir les ressources allouées
kubectl describe pod -l app=portfolio | grep -A5 "Limits\|Requests"

# Surveiller les events (utile si probe échoue)
kubectl get events --sort-by=.lastTimestamp

# Voir la consommation des ressources en temps réel
kubectl top pods -l app=portfolio

# Simuler un crash pour observer la liveness probe (en éditant le deployment)
# kubectl set image deployment/portfolio-deployment portfolio=nginx:fakefail

# Supprimer
kubectl delete deployment portfolio-deployment
```

**Résultats attendus** :
- `kubectl describe pod` → `Liveness: http-get http://:3000/ delay=10s period=15s`
- `kubectl describe pod` → `Readiness: http-get http://:3000/ delay=5s period=10s`
- `kubectl top pods` → consommation < limits définies

---

## TP 4.10 — StatefulSet + PVC

```bash
# Créer le service headless en premier (requis par le StatefulSet)
kubectl apply -f tp410/redis-service-headless.yaml

# Créer le StatefulSet
kubectl apply -f tp410/redis-statefulset.yaml

# Vérifier le StatefulSet
kubectl get statefulsets
kubectl get pods -l app=redis

# Les pods StatefulSet ont un nom ordonné : redis-statefulset-0
kubectl describe pod redis-statefulset-0

# Vérifier que le PVC a été créé automatiquement
kubectl get pvc

# Voir le nom DNS du pod (service headless)
# Format : <pod-name>.<service-name>.<namespace>.svc.cluster.local
# → redis-statefulset-0.redis-headless.default.svc.cluster.local

# Tester Redis
kubectl exec -it redis-statefulset-0 -- redis-cli ping
# Résultat attendu : PONG

# Supprimer
kubectl delete -f tp410/
# Note : les PVC doivent être supprimés manuellement
kubectl delete pvc -l app=redis
```

**Résultats attendus** :
- `kubectl get statefulsets` → `redis-statefulset` avec `READY 1/1`
- `kubectl get pvc` → `redis-data-redis-statefulset-0` en état `Bound`
- `redis-cli ping` → `PONG`

---

## TP 4.11 — Ingress

```bash
# Activer l'addon Ingress sur Minikube
minikube addons enable ingress

# Vérifier que le contrôleur Ingress est Running
kubectl get pods -n ingress-nginx

# Appliquer l'Ingress
kubectl apply -f tp411/ingress.yaml

# Vérifier l'Ingress
kubectl get ingress
kubectl describe ingress portfolio-ingress

# Récupérer l'IP de Minikube
minikube ip

# Ajouter portfolio.local dans /etc/hosts (Linux/WSL)
echo "$(minikube ip) portfolio.local" | sudo tee -a /etc/hosts

# Tester l'Ingress
curl http://portfolio.local

# Ou utiliser minikube tunnel (pour LoadBalancer)
minikube tunnel

# Vérifier via le navigateur : http://portfolio.local

# Supprimer
kubectl delete -f tp411/ingress.yaml
```

**Résultats attendus** :
- `kubectl get ingress` → `portfolio-ingress` avec ADDRESS = IP de Minikube
- `curl http://portfolio.local` → réponse du service webapp

---

## TP 4.12 — Kustomize

```bash
# Vérifier l'installation de kustomize (intégré à kubectl)
kubectl kustomize --help

# Prévisualiser l'environnement DEV (sans appliquer)
kubectl kustomize tp412/overlays/dev

# Appliquer l'environnement DEV
kubectl apply -k tp412/overlays/dev

# Vérifier les ressources préfixées dev-
kubectl get deployments
kubectl get services

# Supprimer l'environnement DEV
kubectl delete -k tp412/overlays/dev

# Prévisualiser l'environnement PROD
kubectl kustomize tp412/overlays/prod

# Appliquer l'environnement PROD
kubectl apply -k tp412/overlays/prod

# Vérifier les ressources préfixées prod- avec 3 replicas
kubectl get deployments
kubectl get pods

# Supprimer l'environnement PROD
kubectl delete -k tp412/overlays/prod
```

**Résultats attendus** :
- DEV → `dev-portfolio-deployment` avec 1 replica, image `:latest`
- PROD → `prod-portfolio-deployment` avec 3 replicas, image `:1.0.6`

---

## TP 4.13 — Dépannage (Debugging)

### Cas 1 — CrashLoopBackOff

```bash
# Créer le pod qui crashe
kubectl apply -f tp413/pod-crashloop.yaml

# Observer le crash en temps réel
kubectl get pods -w

# Une fois CrashLoopBackOff visible :
kubectl describe pod pod-crashloop
# → Section "Events" : Back-off restarting failed container

# Voir les logs (du dernier crash)
kubectl logs pod-crashloop

# Voir les logs du crash précédent
kubectl logs pod-crashloop --previous

# Identifier la cause : exit 1 dans la commande
kubectl get pod pod-crashloop -o yaml | grep -A5 "command"

# Supprimer le pod en erreur
kubectl delete pod pod-crashloop
```

### Cas 2 — ImagePullBackOff

```bash
# Créer le pod avec une fausse image
kubectl apply -f tp413/pod-imagepull.yaml

# Observer l'erreur
kubectl get pods -w

# Diagnostic
kubectl describe pod pod-imagepull-error
# → Events: Failed to pull image "mbargaernest/fake-image:v999"
# → ErrImagePull / ImagePullBackOff

# Vérifier l'image
kubectl get pod pod-imagepull-error -o jsonpath='{.spec.containers[*].image}'

# Corriger en changeant l'image (patch)
kubectl patch pod pod-imagepull-error \
  -p '{"spec":{"containers":[{"name":"fake-container","image":"nginx:1.27-alpine"}]}}'
# Note : les pods ne peuvent pas être patché facilement, mieux vaut supprimer + recréer

# Supprimer et recréer avec le pod correct
kubectl delete pod pod-imagepull-error
kubectl apply -f tp413/pod-correct.yaml
```

### Cas 3 — Pod correct après correction

```bash
# Créer le pod correct
kubectl apply -f tp413/pod-correct.yaml

# Vérifier qu'il démarre correctement
kubectl get pods pod-correct -w

# Voir les events positifs
kubectl describe pod pod-correct

# Accéder au pod
kubectl exec -it pod-correct -- sh

# Port-forward pour tester
kubectl port-forward pod/pod-correct 3099:3000
curl http://localhost:3099

# Nettoyage final
kubectl delete pod pod-correct
```

### Commandes de dépannage générales

```bash
# Voir tous les events du cluster (triés par date)
kubectl get events --sort-by=.lastTimestamp

# Voir les events d'un namespace
kubectl get events -n production

# Voir les logs d'un pod en temps réel
kubectl logs -f <nom-du-pod>

# Voir les logs d'un conteneur spécifique dans un pod multi-conteneurs
kubectl logs <nom-du-pod> -c <nom-conteneur>

# Décrire n'importe quelle ressource
kubectl describe <type> <nom>

# Voir l'état complet en YAML
kubectl get pod <nom> -o yaml

# Exécuter un shell dans un pod
kubectl exec -it <nom-du-pod> -- /bin/sh

# Voir la consommation des ressources
kubectl top nodes
kubectl top pods

# Forcer la suppression d'un pod bloqué
kubectl delete pod <nom> --force --grace-period=0
```

**Résultats attendus** :
- `pod-crashloop` → état `CrashLoopBackOff`, logs montrent `exit 1`
- `pod-imagepull-error` → état `ImagePullBackOff`, events montrent `Failed to pull image`
- `pod-correct` → état `Running` après quelques secondes

---

## 🔧 Commandes utiles Minikube

```bash
# Démarrer avec plus de ressources
minikube start --cpus=2 --memory=4096

# Voir les addons disponibles
minikube addons list

# Activer les addons utiles
minikube addons enable metrics-server
minikube addons enable ingress
minikube addons enable dashboard

# Accéder à un service directement
minikube service <nom-service>

# Tunnel pour LoadBalancer
minikube tunnel

# Supprimer tout et recommencer
minikube delete
minikube start
```

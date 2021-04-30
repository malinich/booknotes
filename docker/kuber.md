#### просмотр env
```
kubectl -n dev get po | grep notif
kubectl -n dev exec  notifications-59945869bf-vhb7n printenv | grep BLOGS_SERVICE 
```

#### перезапуск
```
kubectl -n predev get po | grep notif
kubectl -n predev delete po notifications-consumer-5954c9b4d9-qvv79 
```
#### список подов
```
KUBECONFIG=~/kubernetes-cluster-draft_kubeconfig.yaml kubectl -n dev get po | grep calendar
```

#### logs
```
KUBECONFIG=~/kubernetes-cluster-draft_kubeconfig.yaml kubectl logs -f -n predev notifications-consumer | egrep 'DEBUG|INFO|WARNING'
```

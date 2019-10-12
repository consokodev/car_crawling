docker build -t consoko/crawling_web -t consoko/crawling_web:$SHA -t consoko/crawling_web:latest -f Dockerfile .
docker push consoko/crawling_web
docker push consoko/crawling_web:$SHA
kubectl apply -f k8s
kubectl set image deployments/web-deployment web=consoko/crawling_web:$SHA
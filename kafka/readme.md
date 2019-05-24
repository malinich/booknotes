UI
```
docker run -e ADV_HOST=127.0.0.1 -e EULA="https://dl.lenses.stream/d/?id=bd6b9615-xxxx-4b54-b08a-595045e201a8" --rm -p 3030:3030 -p 9092:9092 -p 2181:2181 -p 8081:8081 landoop/kafka-lenses-dev
           
- Lenses and Kafka will be available in about 30-45 seconds at http://localhost:3030. 
- The default credentials are admin / admin. 
- To disable the sample data generators you can add -e SAMPLEDATA=0. 

```

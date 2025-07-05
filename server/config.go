package main

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func initMongo() {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb+srv://devmanjha:VcLtvS6oWdw7XWMh@web-client-cluster.quyven8.mongodb.net/?retryWrites=true&w=majority&appName=web-client-cluster"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("Mongo connection failed: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Mongo ping failed: %v", err)
	}

	db = client.Database("casino")
	log.Println("Connected to Mongo")
}

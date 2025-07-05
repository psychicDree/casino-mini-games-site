package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Game struct {
	ID   primitive.ObjectID `bson:"_id" json:"id"`
	Name string             `bson:"name" json:"name"`
	URL  string             `bson:"url" json:"url"`
}

func RegisterRoutes(r *mux.Router) {
	initMongo()

	r.HandleFunc("/signup", signupHandler).Methods("POST")
	r.HandleFunc("/login", loginHandler).Methods("POST")

	api := r.PathPrefix("/api").Subrouter()
	api.Use(authMiddleware)
	api.HandleFunc("/wallet", getWalletHandler).Methods("GET")
	api.HandleFunc("/wallet/deposit", depositHandler).Methods("POST")
	api.HandleFunc("/wallet/withdraw", withdrawHandler).Methods("POST")
	api.HandleFunc("/games", gamesHandler).Methods("GET")
	api.HandleFunc("/ws", wsHandler)
}

func gamesHandler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	cur, err := db.Collection("games").Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	defer cur.Close(ctx)

	var games []Game
	for cur.Next(ctx) {
		var g Game
		if err := cur.Decode(&g); err == nil {
			games = append(games, g)
		}
	}
	json.NewEncoder(w).Encode(games)
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	// placeholder for websocket implementation
	w.WriteHeader(http.StatusNotImplemented)
}

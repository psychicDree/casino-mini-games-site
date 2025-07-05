package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type walletRequest struct {
	Amount float64 `json:"amount"`
}

func getWalletHandler(w http.ResponseWriter, r *http.Request) {
    userID := r.Context().Value("userID").(string)
    objID, err := primitive.ObjectIDFromHex(userID)
    if err != nil {
        http.Error(w, "invalid user id", http.StatusBadRequest)
        return
    }

    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    var user User // Make sure the User struct is defined appropriately elsewhere in your code
    err = db.Collection("users").FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
    if err != nil {
        http.Error(w, "user not found", http.StatusNotFound)
        return
    }

    // Example: return the wallet balance as JSON
    json.NewEncoder(w).Encode(user.Wallet)
}
func depositHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}
	var req walletRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$inc": bson.M{"wallet.balance": req.Amount}})
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func withdrawHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "invalid user id", http.StatusBadRequest)
		return
	}
	var req walletRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$inc": bson.M{"wallet.balance": -req.Amount}})
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

package main

import "go.mongodb.org/mongo-driver/bson/primitive"

type Wallet struct {
	Balance float64 `bson:"balance" json:"balance"`
}

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username string             `bson:"username" json:"username"`
	Password string             `bson:"password" json:"-"`
	Wallet   Wallet             `bson:"wallet" json:"wallet"`
}

func NewUser(username, hashedPassword string) *User {
	return &User{
		Username: username,
		Password: hashedPassword,
		Wallet:   Wallet{Balance: 0},
	}
}

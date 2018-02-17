package main

import (
	"github.com/joho/godotenv"
	tumblrlite "github.com/mini-eggs/tumblr-lite/server"
)

func main() {
	godotenv.Load()
	tumblrlite.Start()
}

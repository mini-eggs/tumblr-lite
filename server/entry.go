package tumblrlite

import "net/http"

func serverIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "www/index.html")
}

// Start - Application entry point. Use this within func main() {}
func Start() {
	// static routes
	http.Handle("/", http.FileServer(http.Dir("www")))
	http.HandleFunc("/login", serverIndex)
	http.HandleFunc("/auth", serverIndex)
	http.HandleFunc("/dashboard", serverIndex)

	// api routes
	http.HandleFunc("/api/tumblr/request-token-url", getRequestTokenURL)
	http.HandleFunc("/api/tumblr/receive-token-url", getReceiveTokenURL)
	http.HandleFunc("/api/tumblr/dashboard", getUserDashboard)

	if err := http.ListenAndServe(":3001", nil); err != nil {
		panic(err)
	}
}

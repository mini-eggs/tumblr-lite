package tumblrlite

import "net/http"

func serverIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "www/index.html")
}

func Start() {
	http.Handle("/", http.FileServer(http.Dir("www")))
	http.HandleFunc("/login", serverIndex)
	http.HandleFunc("/auth", serverIndex)
	http.HandleFunc("/dashboard", serverIndex)

	http.HandleFunc("/api/tumblr/request-token-url", GetRequestTokenURL)
	http.HandleFunc("/api/tumblr/dashboard", GetUserDashboard)

	if err := http.ListenAndServe(":3001", nil); err != nil {
		panic(err)
	}
}

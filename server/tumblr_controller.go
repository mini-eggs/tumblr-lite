package tumblrlite

import (
	"encoding/json"
	"net/http"
)

func GetUserDashboard(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	offset := queryValues.Get("offset")
	limit := queryValues.Get("limit")

	posts, err := dashboard(clientOAuthClient(), offset, limit)
	if err != nil {
		http.Error(w, "Error", 500)
		return
	}

	json, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Error", 500)
		return
	}

	w.Write([]byte(json))
}

func GetRequestTokenURL(w http.ResponseWriter, r *http.Request) {
	data, err := requestAuth()
	if err != nil {
		http.Error(w, "Error", 500)
		return
	}

	json, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error", 500)
		return
	}

	w.Write([]byte(json))
}

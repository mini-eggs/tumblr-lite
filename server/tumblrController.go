package tumblrlite

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
)

var (
	tumblrCredentialsKey = "TumblrCredentialsSessionKeyName"
	store                = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))
)

func getUserDashboard(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	offset := queryValues.Get("offset")
	limit := queryValues.Get("limit")

	session, err := store.Get(r, tumblrCredentialsKey)
	if err != nil {
		http.Error(w, "Error retreiving session.", 500)
		return
	}

	tokenT := session.Values["token"]
	tokenSecretT := session.Values["token_secret"]

	if tokenT == nil || tokenSecretT == nil {
		http.Error(w, "Error retreiving session variables.", 500)
		return
	}

	token := tokenT.(string)
	tokenSecret := tokenSecretT.(string)

	posts, err := dashboard(offset, limit, token, tokenSecret)
	if err != nil {
		http.Error(w, "Error receiving dashboard from Tumblr.", 500)
		return
	}

	json, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "JSON Error.", 500)
		return
	}

	w.Write([]byte(json))
}

func getRequestTokenURL(w http.ResponseWriter, r *http.Request) {
	data, err := requestAuth()
	if err != nil {
		http.Error(w, "Could not retreive auth URL from Tumblr.", 401)
		return
	}

	session, err := store.Get(r, tumblrCredentialsKey)
	if err != nil {
		http.Error(w, "Error retreiving session.", 500)
		return
	}

	session.Values["request_token"] = data.requestToken
	session.Values["request_secret"] = data.requestSecret

	err = session.Save(r, w)
	if err != nil {
		http.Error(w, "Error saving session.", 500)
		return
	}

	json, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "JSON Error.", 500)
		return
	}

	w.Write([]byte(json))
}

func getReceiveTokenURL(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	oauthVerifier := queryValues.Get("oauth_verifier")

	session, err := store.Get(r, tumblrCredentialsKey)
	if err != nil {
		http.Error(w, "Error retreiving session.", 500)
		return
	}

	requestTokenT := session.Values["request_token"]
	requestSecreT := session.Values["request_secret"]

	if requestTokenT == nil || requestSecreT == nil {
		http.Error(w, "Error retreiving session variables.", 500)
		return
	}

	requestToken := requestTokenT.(string)
	requestSecret := requestSecreT.(string)

	data, err := receiveAuth(requestToken, requestSecret, oauthVerifier)
	if err != nil {
		http.Error(w, "Error receiving OAuth token and token secret from Tubmlr.", 401)
		return
	}

	session.Values["token"] = data.token
	session.Values["token_secret"] = data.tokenSecret

	err = session.Save(r, w)
	if err != nil {
		http.Error(w, "Error saving session.", 500)
		return
	}

	json, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "JSON Error.", 500)
		return
	}

	w.Write([]byte(json))
}

package tumblrlite

import (
	"net/url"
	"os"

	"github.com/dghubble/oauth1"
	tumblr "github.com/tumblr/tumblr.go"
	tumblrclient "github.com/tumblr/tumblrclient.go"
)

type requestInfo struct {
	requestToken  string
	requestSecret string
	URL           string
}

type receiveInfo struct {
	token       string
	tokenSecret string
}

type tumblrCredentials struct {
	consumerKey    string
	consumerSecret string
	token          string
	tokenSecret    string
	callbackURL    string
	endpoint       oauth1.Endpoint
}

var (
	credentials = tumblrCredentials{
		consumerKey:    os.Getenv("CONSUMER_KEY"),
		consumerSecret: os.Getenv("CONSUMER_SECRET"),
		callbackURL:    "",
		endpoint: oauth1.Endpoint{
			RequestTokenURL: "https://www.tumblr.com/oauth/request_token",
			AuthorizeURL:    "https://www.tumblr.com/oauth/authorize",
			AccessTokenURL:  "https://www.tumblr.com/oauth/access_token",
		},
	}
	oauthConfig = oauth1.Config{
		ConsumerKey:    credentials.consumerKey,
		ConsumerSecret: credentials.consumerSecret,
		CallbackURL:    credentials.callbackURL,
		Endpoint:       credentials.endpoint,
	}
)

func createClient(token string, tokenSecret string) *tumblrclient.Client {
	return tumblrclient.NewClientWithToken(
		credentials.consumerKey,
		credentials.consumerSecret,
		token,
		tokenSecret,
	)
}

func dashboard(offset string, limit string, token string, tokenSecret string) (interface{}, error) {
	props := url.Values{}
	props.Set("offset", offset)
	props.Set("limit", limit)

	client := createClient(token, tokenSecret)

	dash, err := tumblr.GetDashboard(client, props)
	if err != nil {
		return nil, err
	}

	return dash.Posts, nil
}

func requestAuth() (requestInfo, error) {
	requestToken, requestSecret, err := oauthConfig.RequestToken()
	if err != nil {
		return requestInfo{}, err
	}

	authorizationURL, err := oauthConfig.AuthorizationURL(requestToken)
	if err != nil {
		return requestInfo{}, err
	}

	data := requestInfo{
		requestToken:  requestToken,
		requestSecret: requestSecret,
		URL:           authorizationURL.String(),
	}

	return data, nil
}

func receiveAuth(requestToken string, requestSecret string, oauthVerifier string) (receiveInfo, error) {
	accessToken, accessSecret, err := oauthConfig.AccessToken(requestToken, requestSecret, oauthVerifier)
	if err != nil {
		return receiveInfo{}, err
	}

	fullToken := oauth1.NewToken(accessToken, accessSecret)

	data := receiveInfo{
		token:       fullToken.Token,
		tokenSecret: fullToken.TokenSecret,
	}

	return data, nil
}

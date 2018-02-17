package tumblrlite

import (
	"net/url"
	"os"

	"github.com/dghubble/oauth1"
	tumblr "github.com/tumblr/tumblr.go"
	tumblrclient "github.com/tumblr/tumblrclient.go"
)

type requestInfo struct {
	URL    string
	Secret string
}

type TumblrCredentials struct {
	consumer_key    string
	consumer_secret string
	token           string
	token_secret    string
	callback_url    string
	endpoint        oauth1.Endpoint
}

func credentials() TumblrCredentials {
	return TumblrCredentials{
		consumer_key:    os.Getenv("CONSUMER_KEY"),
		consumer_secret: os.Getenv("CONSUMER_SECRET"),
		token:           os.Getenv("TOKEN"),
		token_secret:    os.Getenv("TOKEN_SECRET"),
		callback_url:    "",
		endpoint:        endpoint(),
	}
}

func endpoint() oauth1.Endpoint {
	return oauth1.Endpoint{
		RequestTokenURL: "https://www.tumblr.com/oauth/request_token",
		AuthorizeURL:    "https://www.tumblr.com/oauth/authorize",
		AccessTokenURL:  "https://www.tumblr.com/oauth/access_token",
	}
}

func client() interface{} {
	creds := credentials()
	return tumblrclient.NewClient(
		creds.consumer_key,
		creds.consumer_secret,
	)
}

func clientOAuthClient() *tumblrclient.Client {
	creds := credentials()
	return tumblrclient.NewClientWithToken(
		creds.consumer_key,
		creds.consumer_secret,
		creds.token,
		creds.token_secret,
	)
}

func dashboard(c *tumblrclient.Client, offset string, limit string) (interface{}, error) {
	props := url.Values{}
	props.Set("offset", offset)
	props.Set("limit", limit)

	dash, err := tumblr.GetDashboard(c, props)
	if err != nil {
		return nil, err
	}

	return dash.Posts, nil
}

func requestAuth() (requestInfo, error) {
	creds := credentials()

	config := oauth1.Config{
		ConsumerKey:    creds.consumer_key,
		ConsumerSecret: creds.consumer_secret,
		CallbackURL:    creds.callback_url,
		Endpoint:       creds.endpoint,
	}

	requestToken, requestSecret, err := config.RequestToken()
	if err != nil {
		return requestInfo{}, err
	}

	authorizationURL, err := config.AuthorizationURL(requestToken)
	if err != nil {
		return requestInfo{}, err
	}

	data := requestInfo{
		URL:    authorizationURL.String(),
		Secret: requestSecret,
	}

	return data, nil
}

// func requestAuth() {
// 	creds := credentials()

// 	config := oauth1.Config{
// 		ConsumerKey:    creds.consumer_key,
// 		ConsumerSecret: creds.consumer_secret,
// 		CallbackURL:    creds.callback_url,
// 		Endpoint:       creds.endpoint,
// 	}

// 	requestToken, requestSecret, err := login(config)
// 	if err != nil {
// 		log.Fatalf("Request Token Phase: %s", err.Error())
// 	}
// 	accessToken, err := receivePIN(config, requestToken, requestSecret)
// 	if err != nil {
// 		log.Fatalf("Access Token Phase: %s", err.Error())
// 	}

// 	fmt.Println("Consumer was granted an access token to act on behalf of a user.")
// 	fmt.Printf("token: %s\nsecret: %s\n", accessToken.Token, accessToken.TokenSecret)
// }

// func authURL(config oauth1.Config) (requestToken, requestSecret string, err error) {
// 	requestToken, requestSecret, err = config.RequestToken()
// 	if err != nil {
// 		return "", "", err
// 	}

// 	authorizationURL, err := config.AuthorizationURL(requestToken)
// 	if err != nil {
// 		return "", "", err
// 	}

// 	fmt.Printf("Open this URL in your browser:\n%s\n", authorizationURL.String())
// 	return requestToken, requestSecret, err
// }

// func receivePIN(config oauth1.Config, requestToken, requestSecret string) (*oauth1.Token, error) {
// 	fmt.Printf("Choose whether to grant the application access.\nPaste " +
// 		"the oauth_verifier parameter (excluding trailing #_=_) from the " +
// 		"address bar: ")

// 	var verifier string

// 	_, err := fmt.Scanf("%s", &verifier)

// 	accessToken, accessSecret, err := config.AccessToken(requestToken, requestSecret, verifier)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return oauth1.NewToken(accessToken, accessSecret), err
// }

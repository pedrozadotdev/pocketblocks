package models

import (
	"encoding/json"
	"slices"
	"sync"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

const (
	ParamPblSettings = "pbl_settings"
)

// Settings defines PocketBlocks Organization configuration options
type Settings struct {
	mux sync.RWMutex

	Name          string   `form:"name" json:"name"`
	LogoUrl       string   `form:"logoUrl" json:"logoUrl"`
	IconUrl       string   `form:"iconUrl" json:"iconUrl"`
	HeaderColor   string   `form:"headerColor" json:"headerColor"`
	HomePageAppId string   `form:"homePage" json:"homePage"`
	Script        string   `form:"script" json:"script"`
	Css           string   `form:"css" json:"css"`
	AdminTutorial []string `form:"adminTutorial" json:"adminTutorial"`
	Libs          []string `form:"libs" json:"libs"`
	Plugins       []string `form:"plugins" json:"plugins"`
	Themes        []string `form:"themes" json:"themes"`
	ThemeId       string   `form:"theme" json:"theme"`
	Auths         Auths    `form:"auths" json:"auths"`
}

// Validate makes Settings validatable by implementing [validation.Validatable] interface.
func (s *Settings) Validate() error {
	s.mux.Lock()
	defer s.mux.Unlock()

	return validation.ValidateStruct(s,
		validation.Field(&s.Name, validation.Required),
		validation.Field(&s.LogoUrl, is.URL),
		validation.Field(&s.IconUrl, is.URL),
		validation.Field(&s.HeaderColor, is.HexColor),
		validation.Field(&s.HomePageAppId, validation.Length(15, 15)),
		validation.Field(&s.Themes, validation.Each(is.JSON)),
		validation.Field(&s.Libs, validation.Each(validation.Required)),
		validation.Field(&s.Plugins, validation.Each(validation.Required)),
		validation.Field(&s.ThemeId, validation.Length(24, 24)),
		validation.Field(&s.Auths),
		validation.Field(&s.AdminTutorial, validation.Each(validation.Length(15, 15))),
	)
}

// Merge merges `other` settings into the current one.
func (s *Settings) Merge(other *Settings) error {
	s.mux.Lock()
	defer s.mux.Unlock()

	bytes, err := json.Marshal(other)
	if err != nil {
		return err
	}

	return json.Unmarshal(bytes, s)
}

// Clone creates a new deep copy of the current settings.
func (s *Settings) Clone() (*Settings, error) {
	clone := &Settings{}
	if err := clone.Merge(s); err != nil {
		return nil, err
	}
	return clone, nil
}

// GetOauthByAuthName return the OauthAuth by the provided name
func (s *Settings) GetOauthByAuthName(name string) OauthAuth {
	s.mux.RLock()
	defer s.mux.RUnlock()

	switch name {
	case "google":
		return s.Auths.Google
	case "facebook":
		return s.Auths.Facebook
	case "github":
		return s.Auths.Github
	case "discord":
		return s.Auths.Discord
	case "twitter":
		return s.Auths.Twitter
	case "microsoft":
		return s.Auths.Microsoft
	case "spotify":
		return s.Auths.Spotify
	case "kakao":
		return s.Auths.Kakao
	case "twitch":
		return s.Auths.Twitch
	case "strava":
		return s.Auths.Strava
	case "gitte":
		return s.Auths.Gitte
	case "livechat":
		return s.Auths.Livechat
	case "gitea":
		return s.Auths.Gitea
	case "oidc":
		return s.Auths.Oidc
	case "oidc2":
		return s.Auths.Oidc2
	case "oidc3":
		return s.Auths.Oidc3
	case "apple":
		return s.Auths.Apple
	case "instagram":
		return s.Auths.Instagram
	case "vk":
		return s.Auths.Vk
	case "yandex":
		return s.Auths.Yandex
	case "patreon":
		return s.Auths.Patreon
	case "mailcow":
		return s.Auths.Mailcow
	default:
		return OauthAuth{}
	}
}

// New creates and returns a new default Settings instance.
func NewSettings() *Settings {
	return &Settings{
		Name:          "Acme Organization",
		Themes:        []string{},
		Libs:          []string{},
		Plugins:       []string{},
		AdminTutorial: []string{},
		Auths: Auths{
			Local: LocalAuth{
				AllowSignup: true,
				IdType: []string{
					"username",
					"email",
				},
				AllowUpdate: []string{
					"username",
					"email",
					"password",
				},
			},
		},
	}
}

// Auths defines authentication methods
type Auths struct {
	Local     LocalAuth `form:"local" json:"local"`
	Google    OauthAuth `form:"google" json:"google"`
	Facebook  OauthAuth `form:"facebook" json:"facebook"`
	Github    OauthAuth `form:"github" json:"github"`
	Discord   OauthAuth `form:"discord" json:"discord"`
	Twitter   OauthAuth `form:"twitter" json:"twitter"`
	Microsoft OauthAuth `form:"microsoft" json:"microsoft"`
	Spotify   OauthAuth `form:"spotify" json:"spotify"`
	Kakao     OauthAuth `form:"kakao" json:"kakao"`
	Twitch    OauthAuth `form:"twitch" json:"twitch"`
	Strava    OauthAuth `form:"strava" json:"strava"`
	Gitte     OauthAuth `form:"gitte" json:"gitte"`
	Livechat  OauthAuth `form:"livechat" json:"livechat"`
	Gitea     OauthAuth `form:"gitea" json:"gitea"`
	Oidc      OauthAuth `form:"oidc" json:"oidc"`
	Oidc2     OauthAuth `form:"oidc2" json:"oidc2"`
	Oidc3     OauthAuth `form:"oidc3" json:"oidc3"`
	Apple     OauthAuth `form:"apple" json:"apple"`
	Instagram OauthAuth `form:"instagram" json:"instagram"`
	Vk        OauthAuth `form:"vk" json:"vk"`
	Yandex    OauthAuth `form:"yandex" json:"yandex"`
	Patreon   OauthAuth `form:"patreon" json:"patreon"`
	Mailcow   OauthAuth `form:"mailcow" json:"mailcow"`
}

// LocalAuth is email/username based authentication
type LocalAuth struct {
	AllowSignup       bool     `form:"allowSignup" json:"allowSignup"`
	Label             string   `form:"label" json:"label"`
	IdInputMask       string   `form:"inputMask" json:"inputMask"`
	IdType            []string `form:"type" json:"type"`
	AllowUpdate       []string `form:"allowUpdate" json:"allowUpdate"`
	EmailAutoverified bool     `form:"emailAutoverified" json:"emailAutoverified"`
}

// Validate makes LocalAuth validatable by implementing [validation.Validatable] interface.
func (a *LocalAuth) Validate() error {
	return validation.ValidateStruct(&a,
		validation.Field(&a.IdType, validation.Required, validation.Each(validation.In("username", "email"))),
		validation.Field(&a.AllowUpdate,
			validation.When(
				slices.Contains(a.IdType, "username") && !slices.Contains(a.IdType, "email"),
				validation.Each(validation.In("username", "password"))),
			validation.When(
				slices.Contains(a.IdType, "email") && !slices.Contains(a.IdType, "username"),
				validation.Each(validation.In("email", "password"))),
			validation.When(
				slices.Contains(a.IdType, "email") && slices.Contains(a.IdType, "username"),
				validation.Each(validation.In("email", "username", "password"))),
		),
		validation.Field(&a.EmailAutoverified,
			validation.When(!slices.Contains(a.IdType, "email"), validation.Empty),
		),
	)
}

// OauthAuth is Oauth based authentication
type OauthAuth struct {
	AllowSignup bool   `form:"allowSignup" json:"allowSignup"`
	CustomName  string `form:"customName" json:"customName"`
	IconUrl     string `form:"iconUrl" json:"iconUrl"`
}

// Validate makes LocalAuth validatable by implementing [validation.Validatable] interface.
func (a *OauthAuth) Validate() error {
	return validation.ValidateStruct(&a,
		validation.Field(&a.IconUrl, is.URL),
	)
}

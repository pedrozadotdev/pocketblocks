package utils

import (
	"regexp"

	"github.com/pocketbase/pocketbase/tools/security"
)

const (
	// DefaultIdLength is the default length of the generated id.
	DefaultIdLength = 15

	// DefaultIdAlphabet is the default characters set used for generating the id.
	DefaultIdAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
)

var IdRegex = regexp.MustCompile(`^[^\@\#\$\&\|\.\,\'\"\\\/\s]+$`)

func GenerateId() string {
	return security.RandomStringWithAlphabet(DefaultIdLength, DefaultIdAlphabet)
}

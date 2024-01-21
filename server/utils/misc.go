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

var SlugRegex = regexp.MustCompile(`^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$`)

var UsernameRegex = regexp.MustCompile(`^[\w][\w\.\-]*$`)

func GenerateId() string {
	return security.RandomStringWithAlphabet(DefaultIdLength, DefaultIdAlphabet)
}

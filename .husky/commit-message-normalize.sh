#!/usr/bin/env sh

# Shared commit-message normalization for husky hooks.
# - Removes Cursor attribution trailers
# - Appends DCO Signed-off-by when missing

# Portable in-place sed (works with both GNU and BSD sed).
sed_inplace() {
  # $1 = sed expression, $2 = file
  tmp_file="${2}.sed.tmp"
  sed "$1" "$2" >"$tmp_file" && mv "$tmp_file" "$2"
}

normalize_commit_message() {
  COMMIT_MSG_FILE="$1"

  if [ ! -f "$COMMIT_MSG_FILE" ]; then
    return 0
  fi

  sed_inplace '/cursoragent@cursor\.com/Id' "$COMMIT_MSG_FILE"
  sed_inplace '/^Co-authored-by:.*Cursor/Id' "$COMMIT_MSG_FILE"
  sed_inplace '/^Made with Cursor/Id' "$COMMIT_MSG_FILE"

  if ! grep -iq '^Signed-off-by:' "$COMMIT_MSG_FILE"; then
    printf '\nSigned-off-by: %s <%s>\n' "$(git config user.name)" "$(git config user.email)" >> "$COMMIT_MSG_FILE"
  fi
}

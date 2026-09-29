#!/usr/bin/env sh

# Shared commit-message normalization for husky hooks.
# - Removes Cursor attribution trailers
# - Appends DCO Signed-off-by when missing

normalize_commit_message() {
  COMMIT_MSG_FILE="$1"

  if [ ! -f "$COMMIT_MSG_FILE" ]; then
    return 0
  fi

  sed -i '' '/cursoragent@cursor\.com/Id' "$COMMIT_MSG_FILE"
  sed -i '' '/^Co-authored-by:.*Cursor/Id' "$COMMIT_MSG_FILE"
  sed -i '' '/^Made with Cursor/Id' "$COMMIT_MSG_FILE"

  if ! grep -iq '^Signed-off-by:' "$COMMIT_MSG_FILE"; then
    printf '\nSigned-off-by: %s <%s>\n' "$(git config user.name)" "$(git config user.email)" >> "$COMMIT_MSG_FILE"
  fi
}

#!/bin/sh

CURL="/usr/bin/curl"
CURLARGS="-f -s -S -k"

FINAL_URL="${NGTLY_URL}/api/scraper/queuedClubs/tagTrigger?secret=${SECRET}"

# Make sure NGTLY_URL and SECRET are set
if [ -z "$NGTLY_URL" ] || [ -z "$SECRET" ]; then
  echo "Error: NGTLY_URL and SECRET must be set"
  exit 1
fi

# Execute curl command and capture output
raw="$($CURL $CURLARGS $FINAL_URL 2>&1)"

# Check for curl errors
if [ $? -ne 0 ]; then
  echo "Curl error: $raw"
  exit 1
fi

# Log the URL route
echo "tagTrigger: ${FINAL_URL}"

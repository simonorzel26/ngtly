#!/bin/sh

CURL="/usr/bin/curl"
CURLARGS="-f -s -S -k"

FINAL_URL="https://cf.ngtly.com/api/v1/deploy?uuid=m8ss00o&force=false"
AUTH_TOKEN="1|tf1Xf7yVRqpXxiv3P3Vks2Ry2ltvsbPDazKnHtDV54ddc8f8"

# Execute curl command with auth bearer token and capture output
raw="$($CURL $CURLARGS -H "Authorization: Bearer $AUTH_TOKEN" $FINAL_URL 2>&1)"

# Check for curl errors
if [ $? -ne 0 ]; then
  echo "Curl error: $raw"
  exit 1
fi

# Log the URL route
echo "Deploy triggered: ${FINAL_URL}"

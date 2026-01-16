#!/bin/bash
# Run this script to set up EAS secrets for your project
# Make sure you're in the mobile directory and logged into EAS

echo "Setting up EAS secrets..."

eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "pk_live_Y2xlcmsucmVuZXdseS5jYyQ" --type string

eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.renewly.cc" --type string

eas secret:create --scope project --name EXPO_PUBLIC_VEXO --value "5c33f42d-3739-40a2-aa2b-aefe23a587ed" --type string

eas secret:create --scope project --name EXPO_PUBLIC_PROJECTID --value "fbcc7bf8-0756-49dd-9297-a692d92add79" --type string

eas secret:create --scope project --name EXPO_NO_CAPABILITY_SYNC --value "1" --type string

echo "✅ EAS secrets have been created!"
echo "Run 'eas secret:list' to verify"

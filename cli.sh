#!/bin/bash
echo "RUN CLI ℹ️"
echo "Step 1 " 
echo "Find current IP 🔎"
LOCAL_IP=$(ifconfig en0 | grep inet | grep -v inet6 | cut -d" " -f2)
echo ""
echo "Step 2"
echo "IP:" $LOCAL_IP
echo ""
echo "Step 3"
echo "Create new file"
OUTPUT='{
  "hostname": "'$LOCAL_IP'"
  }'
echo ""
echo "Step 4"
echo "Write IP to file 📝"
echo $OUTPUT > server.json
echo "Done ✅"

# Example: Create a new file and write the current IP to it
#node -e 'import("./test.js").then(dbMod => dbMod.currentIp(22));'
echo "Stopping milvus..."
PROCESS=$(ps -e | grep milvus | grep -v grep | awk '{print $1}')
if [ -z "$PROCESS" ]; then
  echo "No milvus process"
  exit 0
fi
kill -9 $PROCESS
echo "Milvus stopped"
set -e

NAME=$(cat package.json | grep name | head -n 1 |  awk '{print $2}' | sed 's/"//g' | sed 's/,//g')
VERSION=$(cat version | awk '{$1=$1;print}')
echo "publish version ${VERSION}"

git config --local user.name "wangshijun"
git config --local user.email "wangshijun2010@gmail.com"

echo "publishing to npm..."
echo "SKIP_PREFLIGHT_CHECK=true" > .env
npm run bundle

echo "publishing to blocklet registry"
blocklet config registry ${BLOCKLET_REGISTRY}
blocklet publish --developer-sk ${ABTNODE_DEV_SK}

curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"${NAME} v${VERSION} was successfully published\"}" ${SLACK_WEBHOOK}

make release

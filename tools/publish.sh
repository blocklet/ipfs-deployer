set -e

VERSION=$(cat version | awk '{$1=$1;print}')
echo "publish version ${VERSION}"

git config --local user.name "wangshijun"
git config --local user.email "wangshijun2010@gmail.com"

echo "publishing to npm..."
echo "SKIP_PREFLIGHT_CHECK=true" > .env
npm run bundle

# TODO: if you want to publish to npm, uncomment the following and add `NPM_TOKEN` in travis/github-secrets
# npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
# npm publish .blocklet/bundle

make release

# TODO: if you want to deploy to remote node, uncomment the following, and add corresponding deploy params
# deploy to remote ABT Node
# set +e
# NAME=$(cat package.json | grep name | head -n 1 |  awk '{print $2}' | sed 's/"//g' | sed 's/,//g')
# VERSION=$(cat package.json | grep version | head -n 1 |  awk '{print $2}' | sed 's/"//g' | sed 's/,//g')
# if [ "${ALIYUN_NODE_ENDPOINT}" != "" ]; then
#   abtnode deploy .blocklet/bundle --endpoint ${ALIYUN_NODE_ENDPOINT} --access-key ${ALIYUN_NODE_ACCESS_KEY} --access-secret ${ALIYUN_NODE_ACCESS_SECRET} --skip-hooks
#   if [ $? == 0 ]; then
#     echo "deploy to ${ALIYUN_NODE_ENDPOINT} success"
#     curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"${NAME} v${VERSION} was successfully deployed to ${ALIYUN_NODE_ENDPOINT}\"}" ${SLACK_WEBHOOK}
#   else
#     echo "deploy to ${ALIYUN_NODE_ENDPOINT} failed"
#     curl -X POST -H 'Content-type: application/json' --data "{\"text\":\":x: Faild to deploy ${NAME} v${VERSION} to ${ALIYUN_NODE_ENDPOINT}\"}" ${SLACK_WEBHOOK}
#   fi
# fi
# if [ "${AWS_NODE_ENDPOINT}" != "" ]; then
#   abtnode deploy .blocklet/bundle --endpoint ${AWS_NODE_ENDPOINT} --access-key ${AWS_NODE_ACCESS_KEY} --access-secret ${AWS_NODE_ACCESS_SECRET} --skip-hooks
#   if [ $? == 0 ]; then
#     echo "deploy to ${AWS_NODE_ENDPOINT} success"
#     curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"${NAME} v${VERSION} was successfully deployed to ${AWS_NODE_ENDPOINT}\"}" ${SLACK_WEBHOOK}
#   else
#     echo "deploy to ${AWS_NODE_ENDPOINT} failed"
#     curl -X POST -H 'Content-type: application/json' --data "{\"text\":\":x: Faild to deploy ${NAME} v${VERSION} to ${AWS_NODE_ENDPOINT}\"}" ${SLACK_WEBHOOK}
#   fi
# fi

# TODO: if your blocklet is listed in registry, uncomment the following
# trigger ArcBlock/blocklets repo release
# echo "trigger ArcBlock/blocklets repo release"
# .makefiles/trigger_registry_build.sh

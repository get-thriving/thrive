#MISE description="Make raw API calls to the webapi"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE arg "[restishArgs]" double_dash="required" var=#true help="The restish args"

: "${usage_namespace:=}"
: "${usage_restish_args:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

access_token=$(cat "${RUN_ROOT}/$namespace/rest_access_token")

RSH_HEADER="Authorization:Bearer $access_token" restish jupiter "${usage_restish_args[@]}"

#MISE description="Make raw API calls to the webapi"
#USAGE flag "--environ <environ>" help="Jupiter environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE arg "[restishArgs]" double_dash="required" var=#true help="The restish args"

: "${usage_environ:=}"
: "${usage_restish_args:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

access_token=$(cat "${RUN_ROOT}/$environ/rest_access_token")

RSH_HEADER="Authorization:Bearer $access_token" restish jupiter "${usage_restish_args[@]}"

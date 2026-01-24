#MISE description="Make raw API calls to the webapi"
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE arg "[restishArgs]" double_dash="required" var=#true help="The restish args"

: "${usage_instance:=}"
: "${usage_restish_args:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

access_token=$(cat "${RUN_ROOT}/$instance/rest_access_token")

RSH_HEADER="Authorization:Bearer $access_token" restish jupiter "${usage_restish_args[@]}"



set -e

working_directory="$(cd "$(dirname "$0")" && pwd)"
bash "${working_directory}/copydocker.sh"
bash "${working_directory}/runit.sh"

set +e


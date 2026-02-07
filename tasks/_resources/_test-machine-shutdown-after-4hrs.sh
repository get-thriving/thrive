#!/bin/bash
set -euo pipefail

LOG=/var/log/shutdown-script.log
exec > >(tee -a "$LOG") 2>&1

echo "[shutdown] $(date -Is) begin"

echo "[shutdown] shutting down in 4 hours"

shutdown -h +240 "Auto-shutdown after 4 hours"

echo "[shutdown] $(date -Is) done"

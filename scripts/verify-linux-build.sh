#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "Skyrich Production Build Verification"
echo "======================================"
echo ""
echo "WARNING: Run this in WSL, Linux, or CI."
echo "Windows PowerShell/CMD will fail on rollup native binary."
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "$PROJECT_ROOT"

echo "[1/3] Installing dependencies..."
pnpm install

echo ""
echo "[2/3] Running typecheck..."
pnpm run typecheck

echo ""
echo "[3/3] Running build..."
pnpm run build

echo ""
echo "======================================"
echo "BUILD SUCCESSFUL"
echo "======================================"
echo ""
echo "Artifacts:"
echo "  - API:     artifacts/api-server/dist/"
echo "  - Frontend: artifacts/skyrich-tr/dist/public/"
echo ""

# managed-by: golden-path v1
APP_NAME := admin-pages
PKG_MGR ?= yarn
REACT_DIR := react
VTEX_SETUP ?= vtex setup
VTEX_LINK ?= vtex link

.DEFAULT_GOAL := help
SHELL := /usr/bin/env bash
.SHELLFLAGS := -o pipefail -c

.PHONY: help dev build test coverage lint format-check check link run clean sdd-init

help: ## Show available targets
	@awk 'BEGIN {FS=":.*##"; printf "Targets:\n"} /^[a-zA-Z_-]+:.*##/ {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Install dependencies and prepare VTEX IO tooling
	@command -v node >/dev/null 2>&1 || { echo "node is required"; exit 1; }
	@command -v vtex >/dev/null 2>&1 || { echo "vtex CLI is required"; exit 1; }
	$(PKG_MGR) install --frozen-lockfile
	$(PKG_MGR) --cwd $(REACT_DIR) install --frozen-lockfile
	$(VTEX_SETUP)

build: ## Validate app build inputs without publishing
	@echo "VTEX IO builds run on the platform via vtex link/publish."
	@echo "Run 'make check' for local validations before linking."

test: ## Run test suite (delegates to react/ workspace)
	$(PKG_MGR) --cwd $(REACT_DIR) test

coverage: ## Run tests with coverage (LCOV for SonarQube)
	$(PKG_MGR) --cwd $(REACT_DIR) test:coverage

lint: ## Run ESLint without auto-fix
	$(PKG_MGR) --cwd $(REACT_DIR) lint

format-check: ## Verify formatting without rewriting files
	$(PKG_MGR) --cwd $(REACT_DIR) format

check: lint test ## Pre-PR gate: lint then test

link: ## Link app in the active VTEX development workspace
	@echo "This uses the active VTEX account/workspace. Confirm with 'vtex whoami' before running in automation."
	$(VTEX_LINK)

run: link ## Alias for the VTEX IO platform development loop

sdd-init: ## Initialize spec-kit scaffold (.specify/ + integrations)
	specify init .

clean: ## Remove local dependencies and coverage artifacts
	rm -rf node_modules $(REACT_DIR)/node_modules $(REACT_DIR)/coverage coverage

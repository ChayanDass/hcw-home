.DEFAULT_GOAL := help
SHELL := /bin/bash

# -------------------------------------
# Install concurrently if not present
# -------------------------------------
check-concurrently:
	@which concurrently >/dev/null 2>&1 || { \
		echo "Installing 'concurrently' globally..."; \
		npm install -g concurrently; \
	}

# -------------------------------------
# Individual builds
# -------------------------------------
build-admin:
	cd admin && yarn install && yarn build

build-backend:
	cd backend && yarn install && yarn build

build-patient:
	cd patient && yarn install && yarn build

build-practitioner:
	cd practitioner && yarn install && yarn build

build-all: build-admin build-backend build-patient build-practitioner

# -------------------------------------
# Run all apps using concurrently
# -------------------------------------
run-all: check-concurrently
	concurrently \
		"cd backend && yarn start:dev" \
		"cd admin && yarn start" \
		"cd patient && yarn start" \
		"cd practitioner && yarn start"

# -------------------------------------
# Help
# -------------------------------------
help:
	@echo ""
	@echo "Available targets:"
	@echo "  make build-admin           → Build admin app"
	@echo "  make build-backend         → Build backend NestJS app"
	@echo "  make build-patient         → Build patient app"
	@echo "  make build-practitioner    → Build practitioner app"
	@echo "  make build-all             → Build all apps"
	@echo "  make run-all               → Run all apps concurrently"
	@echo ""

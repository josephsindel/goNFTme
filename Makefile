# GoNFTme - Web3 Crowdfunding Platform
.PHONY: help install dev build start clean deploy-testnet deploy-mainnet compile test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build the application
	npm run build

start: ## Start production server
	npm run start

compile: ## Compile smart contracts
	npm run compile

deploy-testnet: ## Deploy contracts to Base Sepolia testnet
	npm run deploy:base-sepolia

deploy-mainnet: ## Deploy contracts to Base mainnet
	npm run deploy:base

clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules
	rm -rf artifacts
	rm -rf cache

test: ## Run unit tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

test-contracts: ## Run smart contract tests
	npm run test:contracts

test-all: test test-contracts ## Run all tests

lint: ## Run linter
	npm run lint

type-check: ## Run TypeScript type checking
	npm run type-check

validate: lint type-check test-all ## Run all validation checks

security: ## Run comprehensive security checks
	npm run security:audit
	npm run security:deps
	npm run security:lint

security-audit: ## Run security audit on dependencies
	npm run security:audit

security-lint: ## Run security-focused linting
	npm run security:lint

sonar-scan: ## Run SonarQube analysis (requires SonarQube server)
	@echo "🔍 Running SonarQube security and quality analysis..."
	npm run sonar:scan

sonar-local: ## Run SonarQube with local scanner
	@echo "🔍 Running local SonarQube analysis..."
	@if command -v sonar-scanner >/dev/null 2>&1; then \
		sonar-scanner; \
	else \
		echo "❌ SonarQube scanner not found. Install with:"; \
		echo "   brew install sonar-scanner  # macOS"; \
		echo "   Or download from: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/"; \
	fi

security-full: security test-coverage sonar-local ## Complete security analysis with coverage

setup: install compile ## Full project setup
	@echo "✅ Project setup complete!"
	@echo "Run 'make dev' to start development server"
	@echo "Run 'make test' to run tests"
	@echo "Run 'make security' for security analysis" 
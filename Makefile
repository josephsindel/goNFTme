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

test: ## Run tests
	npm run test

lint: ## Run linter
	npm run lint

setup: install compile ## Full project setup
	@echo "✅ Project setup complete!"
	@echo "Run 'make dev' to start development server" 
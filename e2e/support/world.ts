import { Page } from '@playwright/test'
import { World as CucumberWorld } from '@cucumber/cucumber'

export interface World extends CucumberWorld {
  page: Page
}

export interface WorldParameters {
  page: Page
}

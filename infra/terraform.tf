terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.8.0"
    }

    sentry = {
      source  = "jianyuan/sentry"
      version = "0.14.8"
    }

    render = {
      source  = "registry.terraform.io/render-oss/render"
      version = "1.8.0"
    }

    docker = {
      source  = "docker/docker"
      version = "~> 0.2"
    }

    algolia = {
      source  = "k-yomo/algolia"
      version = ">= 0.1.0, < 1.0.0"
    }
  }

  backend "gcs" {
    bucket = "jupiter-tfstate"
    prefix = "envs/prod"
  }
}

# GCP

## Setup

variable "GCP_LOGIN_FILE" {
  description = "The GCP login ADC file"
  type        = string
  sensitive   = true
}

provider "google" {
  project     = "get-thriving-main"
  region      = "europe-west1"
  zone        = "europe-west1-c"
  credentials = file(var.GCP_LOGIN_FILE)
}

resource "google_project" "get_thriving_main" {
  name       = "Main"
  project_id = "get-thriving-main"

  org_id          = "817228070588"
  billing_account = "01EF04-88C19E-EF378E"

  auto_create_network = true
}

data "google_compute_default_service_account" "default" {
  project = google_project.get_thriving_main.project_id
}

## APIs

resource "google_project_service" "analyticshub_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "analyticshub.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "androidpublisher_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "androidpublisher.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquery_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "bigquery.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigqueryconnection_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "bigqueryconnection.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquerydatapolicy_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "bigquerydatapolicy.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquerymigration_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "bigquerymigration.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigqueryreservation_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "bigqueryreservation.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquerystorage_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "bigquerystorage.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "cloudapis_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "cloudapis.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "cloudasset_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "cloudasset.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "cloudtrace_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "cloudtrace.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "compute_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "compute.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "dataplex_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "dataplex.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "dataform_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "dataform.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "datastore_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "datastore.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "dns_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "dns.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "logging_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "logging.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "monitoring_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "monitoring.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "osconfig_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "osconfig.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "oslogin_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "oslogin.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "servicemanagement_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "servicemanagement.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "serviceusage_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "serviceusage.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "sql_component_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "sql-component.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "storage_api_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "storage-api.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "storage_component_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "storage-component.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "storage_googleapis_com" {
  project            = google_project.get_thriving_main.project_id
  service            = "storage.googleapis.com"
  disable_on_destroy = true
}

## Service Accounts

resource "google_service_account" "play_store_bundle_uploader" {
  project      = google_project.get_thriving_main.project_id
  account_id   = "play-store-bundle-uploader"
  description  = "Account that will be used to upload bundles to the Play Store"
  display_name = "Play Store Bundle Uploader"
}

## Networking

resource "google_dns_managed_zone" "thrive_sh_test" {
  project     = google_project.get_thriving_main.project_id
  name        = "thrive-sh-test" # the *managed zone* name, not the DNS name
  description = "The test domain for self-hosting"
  dns_name    = "thrive-test.xyz."
  visibility  = "public"
}

resource "google_compute_network" "default" {
  project                                   = google_project.get_thriving_main.project_id
  name                                      = "default"
  description                               = "Default network for the project"
  auto_create_subnetworks                   = true
  delete_default_routes_on_create           = false
  enable_ula_internal_ipv6                  = false
  gateway_ipv4                              = null
  internal_ipv6_range                       = null
  mtu                                       = 0
  network_firewall_policy_enforcement_order = "AFTER_CLASSIC_FIREWALL"
  routing_mode                              = "REGIONAL"
}

variable "WEBAPI_TESTING_PORT" {
  description = "On staging machines this http port is accessible for testing"
  type        = string
  sensitive   = false
}

resource "google_compute_firewall" "default_allow_http" {
  project = google_project.get_thriving_main.project_id
  name    = "default-allow-http"
  network = google_compute_network.default.self_link

  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]

  allow {
    protocol = "tcp"
    ports    = ["80", var.WEBAPI_TESTING_PORT]
  }
}

resource "google_compute_firewall" "default_allow_https" {
  project = google_project.get_thriving_main.project_id
  name    = "default-allow-https"
  network = google_compute_network.default.self_link

  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["https-server"]

  allow {
    protocol = "tcp"
    ports    = ["443", "8000", "80"]
  }
}

resource "google_compute_firewall" "default_allow_icmp" {
  project = google_project.get_thriving_main.project_id
  name    = "default-allow-icmp"
  network = google_compute_network.default.self_link

  description   = "Allow ICMP from anywhere"
  direction     = "INGRESS"
  priority      = 65534
  source_ranges = ["0.0.0.0/0"]

  allow {
    protocol = "icmp"
  }
}

resource "google_compute_firewall" "default_allow_internal" {
  project = google_project.get_thriving_main.project_id
  name    = "default-allow-internal"
  network = google_compute_network.default.self_link

  description   = "Allow internal traffic on the default network"
  direction     = "INGRESS"
  priority      = 65534
  source_ranges = ["10.128.0.0/9"]

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }
}

resource "google_compute_firewall" "default_allow_rdp" {
  project = google_project.get_thriving_main.project_id
  name    = "default-allow-rdp"
  network = google_compute_network.default.self_link

  description   = "Allow RDP from anywhere"
  direction     = "INGRESS"
  priority      = 65534
  source_ranges = ["0.0.0.0/0"]

  allow {
    protocol = "tcp"
    ports    = ["3389"]
  }
}

resource "google_compute_firewall" "default_allow_ssh" {
  project = google_project.get_thriving_main.project_id
  name    = "default-allow-ssh"
  network = google_compute_network.default.self_link

  description   = "Allow SSH from anywhere"
  direction     = "INGRESS"
  priority      = 65534
  source_ranges = ["0.0.0.0/0"]

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}

# Docker Hub

## Setup

variable "DOCKER_REGISTRY_NAME" {
  description = "The docker registry name"
  type        = string
}

variable "DOCKER_REGISTRY_USER" {
  description = "The user for the Docker registry"
  type        = string
  sensitive   = true
}

variable "DOCKER_REGISTRY_PASS" {
  description = "The password for the Docker registry"
  type        = string
  sensitive   = true
}

provider "docker" {
  username = var.DOCKER_REGISTRY_USER
  password = var.DOCKER_REGISTRY_PASS
}

## Repositories

resource "docker_hub_repository" "cli" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "cli"
  description = "This is the repository for the CLI app"
}

resource "docker_hub_repository" "webapi_srv" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-srv"
  description = "This is the repository for the WebAPI server"
}

resource "docker_hub_repository" "webapi_gc_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-gc-do-all"
  description = "This is the repository for the WebAPI gc-do-all cron"
}

resource "docker_hub_repository" "webapi_gen_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-gen-do-all"
  description = "This is the repository for the WebAPI gen-do-all cron"
}

resource "docker_hub_repository" "webapi_schedule_external_sync_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-schedule-external-sync-do-all"
  description = "This is the repository for the WebAPI schedule-external-sync-do-all cron"
}

resource "docker_hub_repository" "webapi_search_index_backfill_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-search-index-backfill-do-all"
  description = "This is the repository for the WebAPI search-index-backfill-do-all cron"
}

resource "docker_hub_repository" "webapi_search_mutation_log_drain_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-search-mutation-log-drain-do-all"
  description = "This is the repository for the WebAPI search-mutation-log-drain-do-all cron"
}

resource "docker_hub_repository" "webapi_search_mutation_requeue_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-search-mutation-requeue-do-all"
  description = "This is the repository for the WebAPI search-mutation-requeue-do-all cron"
}

resource "docker_hub_repository" "webapi_stats_do_all" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webapi-stats-do-all"
  description = "This is the repository for the WebAPI stats-do-all cron"
}

resource "docker_hub_repository" "api" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "api"
  description = "This is the repository for the external API"
}

resource "docker_hub_repository" "mcp" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "mcp"
  description = "This is the repository for the MCP server"
}

resource "docker_hub_repository" "webui" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "webui"
  description = "This is the repository for the WebUI"
}

resource "docker_hub_repository" "docs" {
  namespace   = var.DOCKER_REGISTRY_NAME
  name        = "docs"
  description = "This is the repository for the docs server"
}


# Render

## Setup

variable "RENDER_OWNER_ID" {
  description = "The owner for the Render provider"
  type        = string
  sensitive   = true
}


variable "RENDER_AUTH_TOKEN" {
  description = "The authentication token for Render provider"
  type        = string
  sensitive   = true
}

provider "render" {
  owner_id = var.RENDER_OWNER_ID
  api_key  = var.RENDER_AUTH_TOKEN
}

## Project

resource "render_project" "thrive" {
  name = "Thrive"
  environments = {
    "Production" : {
      name : "Production",
      protected_status : "unprotected"
    },
  }
}

# Sentry

## Setup

variable "SENTRY_AUTH_TOKEN" {
  description = "The authentication token for Sentry provider"
  type        = string
  sensitive   = true
}

provider "sentry" {
  token = var.SENTRY_AUTH_TOKEN
}

data "sentry_organization" "main" {
  slug = "get-thriving"
}

resource "sentry_team" "thrive" {
  organization = data.sentry_organization.main.slug
  name         = "Thrive"
}

## Projects

resource "sentry_project" "webapi_srv" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-srv"
  slug         = "webapi-srv"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_gc_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-gc-do-all"
  slug         = "webapi-gc-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_gen_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-gen-do-all"
  slug         = "webapi-gen-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_schedule_external_sync_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-schedule-external-sync-do-all"
  slug         = "webapi-schedule-external-sync-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_search_index_backfill_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-search-index-backfill-do-all"
  slug         = "webapi-search-index-backfill-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_search_mutation_log_drain_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-search-mutation-log-drain-do-all"
  slug         = "webapi-search-mutation-log-drain-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_search_mutation_requeue_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-search-mutation-requeue-do-all"
  slug         = "webapi-search-mutation-requeue-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "webapi_stats_do_all" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi-stats-do-all"
  slug         = "webapi-stats-do-all"
  platform     = "python-fastapi"
}

resource "sentry_project" "api" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "api"
  slug         = "api"
  platform     = "python-fastapi"
}

resource "sentry_project" "mcp" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "mcp"
  slug         = "mcp"
  platform     = "python-fastapi"
}

resource "sentry_project" "webui" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webui"
  slug         = "webui"
  platform     = "javascript-remix"
}

resource "sentry_project" "cli" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "cli"
  slug         = "cli"
  platform     = "python"
}

resource "sentry_project" "desktop" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "desktop"
  slug         = "desktop"
  platform     = "electron"
}

resource "sentry_project" "mobile" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "mobile"
  slug         = "mobile"
  platform     = "capacitor"
}

# Algolia

variable "ALGOLIA_APP_ID" {
  description = "The Algolia App id"
  type        = string
  sensitive   = true
}

variable "ALGOLIA_ADMIN_API_KEY" {
  description = "The Algolia Admin API Key"
  type        = string
  sensitive   = true
}

provider "algolia" {
  app_id  = var.ALGOLIA_APP_ID
  api_key = var.ALGOLIA_ADMIN_API_KEY
}

# Entity search indices (schema aligned with SQLite `search_index` in
# jupiter.core.search.impl.sqlite.repository.SqliteSearchRepository), plus `instance`
# for per-deployment filtering.
#
# Index names follow docs/universe.md: {universe}-{environment}-entities. The map
# keys below are this stack's deployment slots; each slot sets which universe /
# environment that index serves.

locals {
  algolia_entities_index_specs = {
    production = {
      universe    = "thrive"
      environment = "production"
    }
    staging = {
      universe    = "thrive"
      environment = "staging"
    }
    local = {
      universe    = "dev"
      environment = "local"
    }
  }

  algolia_entities_index_names = {
    for key, spec in local.algolia_entities_index_specs :
    key => "${spec.universe}-${spec.environment}-entities"
  }
}

resource "algolia_index" "entities" {
  for_each = local.algolia_entities_index_names
  name     = each.value


  deletion_protection = false
  attributes_config {
    searchable_attributes = [
      "name",
      "note",
    ]

    attributes_for_faceting = [
      "filterOnly(workspace_ref_id)",
      "filterOnly(ref_id)",
      "instance",
      "entity_tag",
      "archived",
      "filterOnly(tag_ref_ids)",
      "filterOnly(contact_ref_ids)",
    ]

    attributes_to_retrieve = [
      "workspace_ref_id",
      "entity_tag",
      "parent_ref_id",
      "ref_id",
      "name",
      "note",
      "archived",
      "created_time",
      "last_modified_time",
      "archived_time",
      "tag_ref_ids",
      "contact_ref_ids",
      "instance",
    ]
  }

  performance_config {
    numeric_attributes_for_filtering = [
      "created_time",
      "last_modified_time",
      "archived_time",
    ]
  }

  highlight_and_snippet_config {
    attributes_to_highlight = ["name", "note"]
    attributes_to_snippet   = ["name:64", "note:64"]
  }
}
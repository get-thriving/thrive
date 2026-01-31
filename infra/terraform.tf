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
  }

  backend "gcs" {
    bucket = "jupiter-terraform-state"
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
  project     = "thrive-449010"
  region      = "europe-west1"
  zone        = "europe-west1-c"
  credentials = file(var.GCP_LOGIN_FILE)
}

resource "google_project" "thrive_449010" {
  name       = "Thrive"
  project_id = "thrive-449010"

  org_id          = "123594278143"
  billing_account = "011A80-E21205-4F323E"

  auto_create_network = true
}

data "google_compute_default_service_account" "default" {
  project = google_project.thrive_449010.project_id
}

## APIs

resource "google_project_service" "analyticshub_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "analyticshub.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "androidpublisher_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "androidpublisher.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquery_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "bigquery.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigqueryconnection_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "bigqueryconnection.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquerydatapolicy_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "bigquerydatapolicy.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquerymigration_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "bigquerymigration.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigqueryreservation_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "bigqueryreservation.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "bigquerystorage_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "bigquerystorage.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "cloudapis_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "cloudapis.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "cloudasset_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "cloudasset.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "cloudtrace_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "cloudtrace.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "compute_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "compute.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "dataplex_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "dataplex.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "dataform_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "dataform.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "datastore_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "datastore.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "dns_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "dns.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "logging_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "logging.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "monitoring_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "monitoring.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "osconfig_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "osconfig.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "oslogin_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "oslogin.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "servicemanagement_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "servicemanagement.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "serviceusage_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "serviceusage.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "sql_component_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "sql-component.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "storage_api_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "storage-api.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "storage_component_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "storage-component.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "storage_googleapis_com" {
  project            = google_project.thrive_449010.project_id
  service            = "storage.googleapis.com"
  disable_on_destroy = true
}

## Service Accounts

resource "google_service_account" "play_store_bundle_uploader" {
  project      = google_project.thrive_449010.project_id
  account_id   = "play-store-bundle-uploader"
  description  = "Account that will be used to upload bundles to the Play Store"
  display_name = "Play Store Bundle Uploader"
}

## Networking

resource "google_dns_managed_zone" "thrive_sh_test" {
  project     = google_project.thrive_449010.project_id
  name        = "thrive-sh-test" # the *managed zone* name, not the DNS name
  description = "The test domain for self-hosting"
  dns_name    = "thrive-test.xyz."
  visibility  = "public"
}

resource "google_compute_network" "default" {
  project                                   = google_project.thrive_449010.project_id
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
  project = google_project.thrive_449010.project_id
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
  project = google_project.thrive_449010.project_id
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
  project = google_project.thrive_449010.project_id
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
  project = google_project.thrive_449010.project_id
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
  project = google_project.thrive_449010.project_id
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
  project = google_project.thrive_449010.project_id
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

resource "sentry_project" "webapi" {
  organization = data.sentry_organization.main.slug
  teams        = [sentry_team.thrive.slug]
  name         = "webapi"
  slug         = "webapi"
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
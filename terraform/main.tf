
terraform {
  backend "remote" {
    organization = "arus-io"

    workspaces {
      prefix = "demo-"
    }
  }
}

provider "aws" {
  region  = "us-west-2"
}

locals {
  prefix = "demo-${var.environment}"

  default_tags = {
    Environment = var.environment
    ManagedBy = "Terraform"
  }
}

variable "environment" {
  description = "Env"
}

variable "region" {
  default     = "us-west-2"
  description = "AWS region"
}

variable "pgsql_password" {
  description = "Database password"
}

variable "aws_account_id"  {
  description = "AWS Account ID"
}

packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "webapp" {
  type    = string
  default = ""
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "vpc_id" {
  type    = string
  default = "vpc-022f4ec69ba8e0611"
}

variable "subnet_id" {
  type    = string
  default = "subnet-091decd4847fb26db"
}

variable "ami_users" {
  type    = list(string)
  default = ["887717972277"]
}

source "amazon-ebs" "app-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_2023${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI test"
  ami_users       = var.ami_users
  ami_regions = [
    "us-east-1",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }


  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  vpc_id        = "${var.vpc_id}"
  profile       = "dev"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.app-ami"]

  provisioner "file" {
    source      = "${var.webapp}"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
    script = "packer/webapp.sh"
  }

  // post-processor "manifest" {
  //   output     = "./packer/manifest.json"
  //   strip_path = true
  // }
}
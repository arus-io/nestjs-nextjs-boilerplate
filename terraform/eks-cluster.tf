data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

provider "kubernetes" {
  alias                  = "eks"
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = "false"
}

data "aws_availability_zones" "available" {
}

resource "aws_security_group" "worker_group_mgmt" {
  name_prefix = "worker_group_mgmt_one"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    cidr_blocks = [
      "10.0.0.0/8",
    ]
  }
  tags = local.default_tags
}

resource "aws_security_group" "all_worker_mgmt" {
  name_prefix = "all_worker_management"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    cidr_blocks = [
      "10.0.0.0/8",
      "172.16.0.0/12",
      "192.168.0.0/16",
    ]
  }
  tags = local.default_tags
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "14.0.0"

  cluster_name = local.prefix
  subnets      = module.vpc.private_subnets

  cluster_version = 1.19
  tags            = local.default_tags

  vpc_id               = module.vpc.vpc_id
  wait_for_cluster_cmd = "until curl -k -s $ENDPOINT/healthz >/dev/null; do sleep 4; done"

  worker_groups = [
    {
      name                          = "worker-group"
      instance_type                 = "t2.medium"
      root_encrypted                = true
      asg_desired_capacity          = 1
      additional_security_group_ids = [aws_security_group.worker_group_mgmt.id]
    }
  ]

  map_users = (var.environment == "prod") ? ([
    {
      userarn  = "arn:aws:iam::${var.aws_account_id}:user/system/githubactions"
      username = "githubactions"
      groups   = ["system:masters"]
    },
    {
      userarn  = "arn:aws:iam::${var.aws_account_id}:user/smarconi"
      username = "smarconi"
      groups   = ["system:masters"]
    }
  ]):([

  ])
}

data "external" "thumbprint" {
  program = [format("%s/bin/thumbprint.sh", path.module), var.region]
}

resource "aws_iam_openid_connect_provider" "connect" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.external.thumbprint.result.thumbprint]
  url             = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
}

module "alb_ingress_controller" {
  source  = "iplabs/alb-ingress-controller/kubernetes"
  version = "3.1.0"

  providers = {
    kubernetes = kubernetes.eks
  }

  k8s_cluster_type = "eks"
  k8s_namespace    = "kube-system"

  aws_region_name  = var.region
  k8s_cluster_name = data.aws_eks_cluster.cluster.name
  aws_tags         = local.default_tags
}

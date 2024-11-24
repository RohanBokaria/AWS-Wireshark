# AWS Provider Configuration
provider "aws" {
  region = "us-east-1"  
}

# RDS Instance (MySQL)
resource "aws_db_instance" "project_db" {
  allocated_storage    = 20                   # 20GB storage
  engine               = "mysql"             # MySQL engine
  instance_class       = "db.t3.micro"       # Free-tier eligible instance type
  db_name              = "network_latency"   # Database name
  username             = "admin"             # RDS username
  password             = "password123"       # RDS password (hardcoded)
  publicly_accessible  = true                # Make publicly accessible
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}


# Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name = "rds-security-group"

  ingress {
    from_port   = 3306                       # MySQL default port
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]              # Allow access from all IPs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "project_ec2" {
  ami           = "ami-0c02fb55956c7d316"   # Amazon Linux 2 AMI
  instance_type = "t2.micro"                # Free-tier eligible instance type
  key_name      = "AWS Wireshark"           # Replace with your key pair name

  tags = {
    Name = "ProjectEC2"
  }

  # User Data script to configure EC2 instance
  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y git python3
              git clone https://github.com/RohanBokaria/AWS-Wireshark.git
              cd AWS-Wireshark/scripts
              pip3 install -r ../requirements.txt
              python3 setup_database.py
              # Set up a directory for CSV file ingestion
              mkdir -p /home/ec2-user/csv_data
              touch /home/ec2-user/csv_data/ingestion_log.txt

              # Continuously check for new CSV files and process them
              while true; do
                  for file in /home/ec2-user/csv_data/*.csv; do
                      if [ -f "$file" ]; then
                          echo "Processing $file"
                          python3 /home/ec2-user/csv_processor.py $file >> /home/ec2-user/csv_data/ingestion_log.txt
                          rm $file
                      fi
                  done
                  sleep 5  # Sleep for 5 seconds before checking again
              done
              EOF
              
              
}

# Output Variables
output "ec2_public_ip" {
  value = aws_instance.project_ec2.public_ip
  description = "Public IP of the EC2 instance"
}

output "rds_endpoint" {
  value = aws_db_instance.project_db.endpoint
  description = "Endpoint of the RDS instance"
}

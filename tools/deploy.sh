gcloud compute instance-templates create TEMPLATE_NAME \
   --region=us-east1 \
   --network=default \
   --subnet=default \
   --tags=allow-health-check \
   --image-family=debian-10 \
   --image-project=debian-cloud \
   --metadata=startup-script='#! /bin/bash
     sudo apt-get update
     sudo apt-get install apache2 -y
     sudo a2ensite default-ssl
     sudo a2enmod ssl
     vm_hostname="$(curl -H "Metadata-Flavor:Google" \
   http://metadata.google.internal/computeMetadata/v1/instance/name)"
   sudo echo "Page served from: $vm_hostname" | \
   tee /var/www/html/index.html
   sudo systemctl restart apache2'

gcloud compute instance-groups managed create lb-backend-example \
--template=TEMPLATE_NAME --zone=us-east1-b

gcloud compute instance-groups set-named-ports lb-backend-example \
    --named-ports http:80 \
    --zone us-east1-b

gcloud compute firewall-rules create fw-allow-health-check \
    --network=default \
    --action=allow \
    --direction=ingress \
    --source-ranges=130.211.0.0/22,35.191.0.0/16 \
    --target-tags=allow-health-check \
    --rules=tcp:80

gcloud compute addresses create lb-ipv4-1 \
    --ip-version=IPV4 \
    --global

  gcloud compute health-checks create http http-basic-check \
      --port 80
  
gcloud compute backend-services create web-backend-service \
      --load-balancing-scheme=EXTERNAL_MANAGED \
      --protocol=HTTP \
      --port-name=http \
      --health-checks=http-basic-check \
      --global
  

gcloud compute backend-services add-backend web-backend-service \
      --instance-group=lb-backend-example \
      --instance-group-zone=us-east1-b \
      --global

gcloud compute url-maps create web-map-http \
      --default-service web-backend-service
  
gcloud compute url-maps create web-map-https \
      --default-service web-backend-service
  
gcloud compute target-https-proxies create https-lb-proxy \
      --url-map=web-map-https \
      --ssl-certificates=www-ssl-cert

gcloud compute forwarding-rules create https-content-rule \
      --load-balancing-scheme=EXTERNAL_MANAGED \
      --address=lb-ipv4-1 \
      --global \
      --target-https-proxy=https-lb-proxy \
      --ports=443
  
gcloud compute ssl-policies create my-ssl-policy \
      --profile MODERN \
      --min-tls-version 1.0
  
gcloud compute target-https-proxies update https-lb-proxy \
      --ssl-policy my-ssl-policy
  
gcloud compute target-http-proxies create http-lb-proxy \
      --url-map=web-map-http
  
gcloud compute forwarding-rules create http-content-rule \
      --load-balancing-scheme=EXTERNAL_MANAGED \
      --address=lb-ipv4-1 \
      --global \
      --target-http-proxy=http-lb-proxy \
      --ports=80
  
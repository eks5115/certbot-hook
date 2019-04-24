# certbot-hook

## install
  
    npm link
    
## use

    sudo certbot certonly --manual -d "*.github.com" --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory --manual-auth-hook certbot-hook
    
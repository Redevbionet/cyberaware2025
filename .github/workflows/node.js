name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Build project
      run: npm run build

    - name: Deploy to Server
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        SERVER: your_server_ip
        USER: your_server_user
      run: |
        echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
        ssh -o StrictHostKeyChecking=no $USER@$SERVER "cd /var/www/myapp && git pull origin main && npm install && npm run build"
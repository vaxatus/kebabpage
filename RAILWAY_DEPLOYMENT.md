# 🚂 Railway Deployment Guide

This guide explains how to deploy the kebab ordering website to Railway.

## ✅ Railway Compatibility Checklist

The project is now fully compatible with Railway:

- ✅ **Node.js 20**: Using latest LTS version
- ✅ **Express Server**: Simple server.js for production
- ✅ **Health Check**: `/health` endpoint for monitoring
- ✅ **Environment Variables**: PORT support for Railway
- ✅ **Build Scripts**: Optimized for Railway's Nixpacks
- ✅ **Static Files**: Proper serving of React build
- ✅ **Docker Support**: Multi-stage build for efficiency

## 🚀 Quick Railway Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Railway compatibility"
   git push origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy

### Method 2: Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

## 📋 Railway Configuration Files

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "yarn install && yarn build"
  },
  "deploy": {
    "startCommand": "yarn start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "yarn"]

[phases.install]
cmds = ["yarn install --frozen-lockfile"]

[phases.build]
cmds = ["yarn build"]

[start]
cmd = "yarn start"

[variables]
NODE_ENV = "production"
```

## 🔧 Environment Variables

Railway will automatically set:
- `PORT`: Railway assigns this automatically
- `NODE_ENV`: Set to "production"

Optional variables you can set:
- `VITE_RESTAURANT_NAME`: Your restaurant name
- `VITE_PHONE`: Restaurant phone number
- `VITE_ADDRESS`: Restaurant address

## 🏗️ Build Process

Railway will:
1. Detect Node.js project
2. Install dependencies with `yarn install`
3. Build React app with `yarn build`
4. Start Express server with `yarn start`

## 🔍 Health Monitoring

The app includes a health check endpoint:
- **URL**: `https://your-app.railway.app/health`
- **Response**: 
  ```json
  {
    "status": "ok",
    "timestamp": "2025-08-19T21:24:08.797Z",
    "port": 3000,
    "env": "production"
  }
  ```

## 🐳 Docker Alternative

If you prefer Docker deployment on Railway:

1. **Enable Docker**:
   - Add `Dockerfile` to your repo
   - Railway will auto-detect and use Docker

2. **Docker Configuration**:
   - Multi-stage build for optimization
   - Production-ready with security
   - Health checks included

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (should be 20+)
- Verify all dependencies in package.json
- Check build logs in Railway dashboard

### App Won't Start
- Ensure `yarn start` works locally
- Check PORT environment variable usage
- Verify health check endpoint

### Static Files Not Loading
- Confirm `dist` folder is created during build
- Check Express static file serving
- Verify build output in Railway logs

## 📊 Performance Optimization

Railway deployment includes:
- **Gzip Compression**: Automatic by Railway
- **CDN**: Global edge locations
- **Auto-scaling**: Based on traffic
- **Health Monitoring**: Automatic restarts

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Nixpacks Documentation](https://nixpacks.com)
- [Node.js on Railway](https://docs.railway.app/guides/nodejs)

## 🎯 Next Steps After Deployment

1. **Custom Domain**: Add your domain in Railway dashboard
2. **SSL Certificate**: Automatic with custom domains
3. **Environment Variables**: Configure in Railway dashboard
4. **Monitoring**: Set up alerts and monitoring
5. **CI/CD**: Automatic deployments on git push

---

**Your kebab ordering website is now Railway-ready! 🥙✨**

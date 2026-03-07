# PowerShell Deployment Script for cPanel
# Run this script to prepare files for cPanel upload

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gidel Fiavor - cPanel Deployment Prep" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build frontend
Write-Host "[1/4] Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend built successfully!" -ForegroundColor Green

# Step 2: Create deployment folder
$deployDir = ".\deploy-cpanel"
Write-Host "[2/4] Creating deployment folder..." -ForegroundColor Yellow

if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null
New-Item -ItemType Directory -Path "$deployDir\public_html" | Out-Null
New-Item -ItemType Directory -Path "$deployDir\gidelfiavor-api" | Out-Null

# Step 3: Copy frontend files
Write-Host "[3/4] Copying frontend files..." -ForegroundColor Yellow
Copy-Item -Recurse ".\dist\*" "$deployDir\public_html\"
Copy-Item ".\public_html\.htaccess" "$deployDir\public_html\" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "$deployDir\public_html\uploads" -Force -ErrorAction SilentlyContinue | Out-Null

# Step 4: Copy backend files
Write-Host "[4/4] Copying backend files..." -ForegroundColor Yellow
Copy-Item ".\server\index.js" "$deployDir\gidelfiavor-api\"
Copy-Item ".\server\package.json" "$deployDir\gidelfiavor-api\"
Copy-Item ".\server\validation.js" "$deployDir\gidelfiavor-api\"
Copy-Item ".\server\socialMediaApi.js" "$deployDir\gidelfiavor-api\"
Copy-Item ".\server\ecosystem.config.cjs" "$deployDir\gidelfiavor-api\"
Copy-Item ".\server\.env.example" "$deployDir\gidelfiavor-api\"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment files ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files are in: $deployDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload 'public_html' contents to cPanel public_html folder"
Write-Host "2. Upload 'gidelfiavor-api' folder to home directory"
Write-Host "3. Create .env file in gidelfiavor-api with your DATABASE_URL"
Write-Host "4. Setup Node.js app in cPanel pointing to gidelfiavor-api"
Write-Host ""
Write-Host "See docs/CPANEL_DEPLOYMENT.md for detailed instructions"

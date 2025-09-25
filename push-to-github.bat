@echo off
echo Shah Sultan's IELTS Academy - GitHub Push Script
echo ================================================

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    echo.
    echo Alternative: Use GitHub Desktop (https://desktop.github.com/)
    pause
    exit /b 1
)

echo Git is installed. Proceeding with setup...

echo Configuring Git user (if not already configured)...
git config --global user.name "Abira"
git config --global user.email "abira@example.com"

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: Shah Sultan's IELTS Academy - Professional IELTS exam platform with 5-logo header, clean interfaces, and complete admin panel"

echo Adding remote repository...
git remote add origin https://github.com/abira1/shahsultansbackup.git

echo Setting main branch...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================
    echo SUCCESS! Your project is now on GitHub!
    echo Visit: https://github.com/abira1/shahsultansbackup
    echo ================================
) else (
    echo.
    echo There was an error pushing to GitHub.
    echo This might be due to:
    echo - Authentication required (GitHub login)
    echo - Repository already exists with content
    echo - Network connection issues
    echo.
    echo Try using GitHub Desktop as an alternative:
    echo https://desktop.github.com/
)

pause
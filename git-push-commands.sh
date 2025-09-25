#!/bin/bash
# Git commands to push Shah Sultan's IELTS Academy to GitHub
# Run these commands after installing Git

echo "Shah Sultan's IELTS Academy - GitHub Push Script"
echo "================================================="

# Navigate to project directory
cd "C:\Users\Aminul\Downloads\Compressed\shahsultansieltsacademy"

# Configure Git (run once)
echo "Configuring Git user..."
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Initialize repository
echo "Initializing Git repository..."
git init

# Add all files to staging
echo "Adding all project files..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Shah Sultan's IELTS Academy - Professional IELTS exam platform

Features:
- Professional exam interfaces with 5-logo header (IELTS, Shah Sultan, British Council, IDP, Cambridge)
- Clean start pages for all exam types (Listening, Reading, Writing)
- Student dashboard with exam selection
- Admin panel for question management
- Firebase integration for authentication and data storage
- TypeScript + React + Tailwind CSS tech stack
- Comprehensive question types support
- Professional navigation and timer system"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Add remote repository
echo "Adding GitHub remote..."
git remote add origin https://github.com/abira1/shahsultansbackup.git

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "SUCCESS! Your Shah Sultan's IELTS Academy is now on GitHub!"
echo "Visit: https://github.com/abira1/shahsultansbackup"
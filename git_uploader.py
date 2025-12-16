#!/usr/bin/env python3
"""
Git Upload Script for Hope4All Project
Automatically stages, commits, and pushes all changes to GitHub
"""

import subprocess
import sys
from datetime import datetime

def run_git_command(command, description):
    """Execute git command with error handling"""
    try:
        print(f"🔄 {description}...")
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} failed")
            print(f"   Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ Exception during {description}: {str(e)}")
        return False

def main():
    print("🚀 Starting Git upload process for Hope4All project...")
    print(f"📅 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 60)
    
    # Get current branch
    if not run_git_command("git branch --show-current", "Getting current branch"):
        return False
    
    # Check git status
    if not run_git_command("git status --porcelain", "Checking git status"):
        return False
    
    # Add all changes (modified files, new files, deleted files)
    if not run_git_command("git add -A", "Staging all changes"):
        return False
    
    # Check if there are changes to commit
    result = subprocess.run("git diff --cached --quiet", shell=True)
    if result.returncode == 0:
        print("📋 No changes to commit")
        print("✅ Repository is already up-to-date")
        return True
    
    # Create commit message with timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    commit_message = f"Hope4All Update - {timestamp}"
    
    # Commit changes
    commit_command = f'git commit -m "{commit_message}"'
    if not run_git_command(commit_command, "Committing changes"):
        return False
    
    # Push to remote
    if not run_git_command("git push origin main", "Pushing to GitHub"):
        print("\n🔐 If push failed due to authentication:")
        print("   1. Make sure you're logged in: git config --global user.name 'Your Name'")
        print("   2. Make sure you're logged in: git config --global user.email 'your.email@example.com'")
        print("   3. For GitHub, use personal access token instead of password")
        print("   4. Or set up SSH keys for passwordless authentication")
        return False
    
    print("-" * 60)
    print("🎉 Successfully uploaded all changes to GitHub!")
    print(f"📊 Repository: https://github.com/Nasir-zia/Hope4All")
    print(f"⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

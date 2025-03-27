# Clone the repository if you haven't already
git clone https://github.com/jvegaAD/crc-seguimiento-estado-proyectos.git

# Navigate to the project directory
cd crc-seguimiento-estado-proyectos

# Make sure you have the latest version of the main branch
git checkout main
git pull origin main

# Create a new branch called 'prototype'
git checkout -b prototype

# Now you can make changes to your code

# After making changes, stage them
git add .

# Commit your changes
git commit -m "Add prototype features"

# Push the branch to GitHub
git push -u origin prototype

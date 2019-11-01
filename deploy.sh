#!/bin/bash

# Exit with nonzero exit code if anything fails.
set -e

echo "Pull request: ${TRAVIS_PULL_REQUEST}"
echo "Branch: ${TRAVIS_BRANCH}"

if [[ "${TRAVIS_BRANCH}" == "master" ]] || [[ "${TRAVIS_BRANCH}" == "develop" ]]
then
  echo "Correct branch"
  # Define repository relative GitHub address.
  repository="dslekomtsev/InvoicesRestApi"
  # Clone project into 'repository' subdirectory && move to it.
  echo "Prepare for deploy to gh-pages."
  echo $PWD
  echo "Clone ${repository} repository & checkout latest version of gh-pages branch."
  git clone --recursive "https://github.com/${repository}.git" repo
  cd repo
  echo $PWD
  # Checkout gh-pages branch & pull it's latest version.
  git checkout gh-pages
  git pull
  # Remove results of previous deploy (for current branch) & recreate directory.
  echo "Remove results of previous deploy (for ${TRAVIS_BRANCH} branch)."
  rm -rf "${TRAVIS_BRANCH}"
  mkdir "${TRAVIS_BRANCH}"
  # Copy builded ember application from 'dist' directory into 'repository/${TRAVIS_BRANCH}'.
  echo "Copy application (for ${TRAVIS_BRANCH} branch)."
  cp -r ../src/* "${TRAVIS_BRANCH}"
  cd "${TRAVIS_BRANCH}"
  ls -l
  cd ..
  # Prevent "empty" commit and build failure.
  if [ -f ".gitkeep" ]
  then
    rm -rf .gitkeep
  else
    touch .gitkeep
  fi
  # Configure git.
  git config user.name "dslekomtsev"
  git config user.email "dlekomtsev@ics.perm.ru"
  echo "Commit & push changes."
  git add --all
  git commit -m "Update gh-pages for ${TRAVIS_BRANCH} branch"
  # Redirect any output to /dev/null to hide any sensitive credential data that might otherwise be exposed.
  git push --force --quiet "https://${GITHUB_TOKEN}@github.com/${repository}.git" > /dev/null 2>&1
fi


echo "Deploy to gh-pages finished."
 sudo apt-get install software-properties-common # debian only
sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"
curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install heroku

heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt --app coderuss

# https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-apt

git push https://git.heroku.com/coderuss.git master
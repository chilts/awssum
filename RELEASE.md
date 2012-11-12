# RELEASE PROCEDURE #

    $ npm test
    $ make jshint

    $ vi package.json # change the version number

    BRANCH=0.12
    RELEASE=0.12.0

    git commit -m "Bump version number to v$RELEASE" package.json RELEASE.md
    git push origin master

Create the tag:

    git tag v$RELEASE
    git push origin v$RELEASE

Start the branch (if this is the start of a vx.y.0 series):

    git branch v$BRANCH
    git push origin v$BRANCH

Then, in a /tmp/ directory:

    cd /tmp/
    rm -rf node-awssum
    git clone ~/appsattic/node-awssum/
    cd node-awssum
    npm publish
    cd ~/appsattic/node-awssum/

Once that has been published, look for the tweet to retweet on:

* https://twitter.com/#!/nodenpm

Then finally, change the topic on #awssum on Freenode:

    /topic AwsSum v0.11.0 (latest) | https://awssum.io/ | Please use https://gist.github.com/ to paste

... and update http://awssum.io/ ...

    vi _config.yml
    vi changelog.html

(Ends)

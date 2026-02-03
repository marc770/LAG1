# Demo version
Please browse to [https://marc770.github.io/](https://marc770.github.io/)

# Developer info

To get started, first build the app with Docker.
```
docker build -t my-pwa .
```

Then run it.
```
docker run --rm -p 4173:4173 my-pwa
```

Finally, simply browse to [localhost:4173](http://localhost:4173/)

## Deploy the app
First run
```
npm run build
```

Then replace the docs in the github pages repo.
```
rm -rf ../marc770.github.io/docs/
cp docs/ /marc770.github.io/docs/
```

Finally, commit and push in that repo.

# Demo version
Please browse to [https://marc770.github.io/](https://marc770.github.io/)

# High-level concept
* The app contains crisis plans (**scenarios**).
* The app uses public information/heartbeats about current power outages and internet loss + user input to figure out what scenario to activate
* From a single installation, the app can be shared offline (LAN or bluetooth[^bluetooth]).
* The app distributes **missions** among the users.
* All mission actions are logged by the app.
* Users **synchronize** their logs by sharing JSON data through QR codes[^QR].
* Based on the logs, the app generates new missions until the scenario is completed.


[^bluetooth]:
    Bluetooth can be used for native apps but not PWAs.
[^QR]:
    As the minimal, robust strategy that users are familiar enough with to use in a stressful situation. Less minimal stragies are used if they are available during the crisis.

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

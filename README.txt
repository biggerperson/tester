Short README (setup steps / notes)

Install dependencies:
yarn add react-native-mapbox-gl/maps @react-native-async-storage/async-storage
For TypeScript projects: add types as needed
iOS:
Add Mapbox SDK instructions per react-native-mapbox-gl docs
Add NSLocationWhenInUseUsageDescription to Info.plist
pod install in ios folder
Android:
Add Mapbox Maven repo in android/build.gradle
Add internet and location permissions in AndroidManifest.xml
Mapbox token
Put your Mapbox token in src/config.ts (or better: dotenv + native config)
Run
npx react-native run-ios
npx react-native run-android
Security & compliance notes

Do not check your Mapbox token into public repos for production apps. Use environment injection or secure key stores.
For apps in humanitarian/disaster domains, consider privacy: minimize PII and secure persisted data at rest (encryption) for sensitive contexts.
Testing the baseline

Manual tests:
Launch app -> map should display, centered on default or on first pin if persisted
Long-press on map -> new pin placed and visible, persists on app restart
Type in search bar -> suggestions appear; selecting one centers and pins that location
Edge cases:
No network -> geocoding fails gracefully (empty list)
Mapbox token incorrect -> Mapbox renders error; guard during startup
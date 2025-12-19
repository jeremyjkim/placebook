# Placebook

A minimal Flutter app to save personal spots on a map. Focuses on speed and simplicity.

## Tech stack
- Flutter (Material 3)
- Riverpod for state management
- GoRouter for navigation
- Google Maps (google_maps_flutter)
- Geolocator for device location
- Isar for local storage

## Google Maps API key
1. Create an API key in the Google Cloud console with Maps SDK for Android/iOS enabled.
2. Add the key to your platform configs:
   - **Android:** set the value for `com.google.android.geo.API_KEY` in `android/app/src/main/AndroidManifest.xml`.
   - **iOS:** add `io.flutter.embedded_views_preview` and your key in `ios/Runner/AppDelegate.swift` or `Info.plist` under `GMSApiKey`.
3. Rebuild the app after updating the keys.

## Running the app
1. Install Flutter (latest stable) and set up an emulator or device.
2. Fetch dependencies:
   ```bash
   flutter pub get
   ```
3. Generate Isar code (if you make schema changes):
   ```bash
   dart run build_runner build --delete-conflicting-outputs
   ```
4. Run the app:
   ```bash
   flutter run
   ```

## Project structure
```
lib/
  main.dart
  app.dart
  core/
    model/place.dart
    repo/place_repository.dart
  features/
    map/map_screen.dart
    places/places_list_screen.dart
    place_detail/place_detail_screen.dart
```

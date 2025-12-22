# Placebook

A minimal Flutter app to save personal spots on a map. Focuses on speed and simplicity.

## Tech stack
- Flutter (Material 3)
- Riverpod for state management
- GoRouter for navigation
- Kakao Maps (kakao_map_plugin)
- Geolocator for device location
- Isar for local storage

## Kakao Maps API key
1. Create a Kakao JavaScript key in the Kakao Developers console.
2. Add the key to your platform configs so the Kakao SDK can initialize:
   - **Android:** set the value for `com.kakao.sdk.AppKey` in `android/app/src/main/AndroidManifest.xml`.
   - **iOS:** set `KAKAO_APP_KEY` in your `Info.plist`.
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

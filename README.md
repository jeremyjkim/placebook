# Placebook

A minimal Flutter app to save personal spots on a map. Focuses on speed and simplicity.

## Tech stack
- Flutter (Material 3)
- Riverpod for state management
- GoRouter for navigation
- Kakao Maps (kakao_map_plugin)
- Geolocator for device location
- Isar for local storage

## Kakao Maps app key
1. Create a Kakao Native App Key in the Kakao Developers console.
2. Pass the key to the app at build/run time using a Dart define:
   ```bash
   flutter run --dart-define=KAKAO_MAP_APP_KEY=your_native_app_key
   ```
3. Platform setup (add these once the platform folders are present in the project):
   - **Android:** add the key to `android/app/src/main/AndroidManifest.xml` using a `<meta-data android:name="com.kakao.sdk.AppKey" android:value="${KAKAO_MAP_APP_KEY}" />` entry and ensure the manifest placeholders are wired to your build configuration.
   - **iOS:** add a `KAKAO_APP_KEY` entry with the native app key to `ios/Runner/Info.plist` and ensure the Kakao map SDK is initialized at launch.
4. Rebuild the app after updating the keys.

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

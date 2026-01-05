import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:isar/isar.dart';
import 'package:kakao_map_plugin/kakao_map_plugin.dart';

import 'app.dart';
import 'core/repo/place_repository.dart';

final isarProvider = Provider<Isar>((ref) => throw UnimplementedError());
final placeRepositoryProvider = Provider<PlaceRepository>((ref) {
  final isar = ref.watch(isarProvider);
  return PlaceRepository(isar);
});

const kakaoMapAppKey = String.fromEnvironment('KAKAO_MAP_APP_KEY');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (kakaoMapAppKey.isEmpty) {
    throw StateError(
      'Missing KAKAO_MAP_APP_KEY. Provide it via --dart-define at build time.',
    );
  }

  AuthRepository.initialize(appKey: kakaoMapAppKey);
  final isar = await PlaceRepository.init();

  runApp(
    ProviderScope(
      overrides: [isarProvider.overrideWithValue(isar)],
      child: const App(),
    ),
  );
}

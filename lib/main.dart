import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:isar/isar.dart';

import 'app.dart';
import 'core/repo/place_repository.dart';

final isarProvider = Provider<Isar>((ref) => throw UnimplementedError());
final placeRepositoryProvider = Provider<PlaceRepository>((ref) {
  final isar = ref.watch(isarProvider);
  return PlaceRepository(isar);
});

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final isar = await PlaceRepository.init();

  runApp(
    ProviderScope(
      overrides: [isarProvider.overrideWithValue(isar)],
      child: const App(),
    ),
  );
}

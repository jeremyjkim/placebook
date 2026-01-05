import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:isar/isar.dart';

import '../../core/model/place.dart';
import '../../core/repo/place_repository.dart';
import '../../main.dart';

final placesStreamProvider = StreamProvider<List<Place>>((ref) {
  final repo = ref.watch(placeRepositoryProvider);
  return repo.watchPlaces();
});

class PlacesListScreen extends ConsumerWidget {
  const PlacesListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncPlaces = ref.watch(placesStreamProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved places'),
        actions: [
          IconButton(
            icon: const Icon(Icons.map_outlined),
            tooltip: 'Map',
            onPressed: () => context.go('/'),
          ),
        ],
      ),
      body: asyncPlaces.when(
        data: (places) {
          if (places.isEmpty) {
            return const Center(
              child: Text('No places yet. Long-press on the map to add one.'),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: places.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final place = places[index];
              return ListTile(
                leading: Text(place.emoji, style: const TextStyle(fontSize: 24)),
                title: Text(place.note),
                subtitle: Text(
                  '${place.latitude.toStringAsFixed(4)}, ${place.longitude.toStringAsFixed(4)}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                onTap: () => context.push('/places/${place.id}'),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Something went wrong: $e')),
      ),
      // TODO: Add search and filter by emoji.
    );
  }
}

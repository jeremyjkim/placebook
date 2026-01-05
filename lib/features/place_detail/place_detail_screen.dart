import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:kakao_map_plugin/kakao_map_plugin.dart';

import '../../core/model/place.dart';
import '../../core/repo/place_repository.dart';
import '../../main.dart';

final placeDetailProvider = FutureProvider.family<Place?, int>((ref, id) async {
  final repo = ref.read(placeRepositoryProvider);
  return repo.getPlace(id);
});

class PlaceDetailScreen extends ConsumerWidget {
  const PlaceDetailScreen({super.key, required this.id});

  final int? id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (id == null) {
      return const Scaffold(
        body: Center(child: Text('Invalid place id')),
      );
    }
    final asyncPlace = ref.watch(placeDetailProvider(id!));
    return Scaffold(
      appBar: AppBar(
        title: const Text('Place detail'),
        actions: [
          IconButton(
            icon: const Icon(Icons.list_alt_outlined),
            tooltip: 'All places',
            onPressed: () => context.go('/places'),
          ),
        ],
      ),
      body: asyncPlace.when(
        data: (place) {
          if (place == null) {
            return const Center(child: Text('Place not found'));
          }
          final position = LatLng(place.latitude, place.longitude);
          return Column(
            children: [
              SizedBox(
                height: 320,
                child: KakaoMap(
                  center: position,
                  level: 4,
                  markers: [
                    Marker(
                      markerId: 'place',
                      latLng: position,
                      infoWindowContent: '${place.emoji} ${place.note}',
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(place.emoji, style: const TextStyle(fontSize: 32)),
                    const SizedBox(height: 8),
                    Text(
                      place.note,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Saved on ${place.createdAt.toLocal()}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Location: ${place.latitude.toStringAsFixed(5)}, ${place.longitude.toStringAsFixed(5)}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 16),
                    const Text('Saved locally with Isar.'),
                    // TODO: Add edit and delete actions in the future.
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Unable to load place: $e')),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../core/model/place.dart';
import '../../core/repo/place_repository.dart';
import '../../main.dart';

class MapScreen extends ConsumerStatefulWidget {
  const MapScreen({super.key});

  @override
  ConsumerState<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends ConsumerState<MapScreen> {
  final _noteController = TextEditingController();
  final List<String> _emojiOptions = ['📍', '🌟', '🏞️', '🍴', '🎯'];
  String _selectedEmoji = '📍';
  Position? _currentPosition;
  LatLng? _tempPin;
  GoogleMapController? _mapController;

  @override
  void initState() {
    super.initState();
    _initLocation();
  }

  @override
  void dispose() {
    _noteController.dispose();
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _initLocation() async {
    try {
      final position = await _determinePosition();
      if (!mounted) return;
      setState(() {
        _currentPosition = position;
      });
      if (_mapController != null) {
        _mapController!.animateCamera(
          CameraUpdate.newLatLngZoom(
            LatLng(position.latitude, position.longitude),
            15,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Location unavailable: $e')),
      );
    }
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error(
        'Location permissions are permanently denied, cannot request permissions.',
      );
    }

    return Geolocator.getCurrentPosition();
  }

  void _onLongPress(LatLng position) {
    setState(() {
      _tempPin = position;
    });
    _openBottomSheet(position);
  }

  void _openBottomSheet(LatLng position) {
    _noteController.clear();
    _selectedEmoji = _emojiOptions.first;
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 16,
            right: 16,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    'New place',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: _emojiOptions
                    .map(
                      (emoji) => ChoiceChip(
                        label: Text(emoji, style: const TextStyle(fontSize: 18)),
                        selected: _selectedEmoji == emoji,
                        onSelected: (_) {
                          setState(() {
                            _selectedEmoji = emoji;
                          });
                        },
                      ),
                    )
                    .toList(),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _noteController,
                maxLength: 80,
                decoration: const InputDecoration(
                  labelText: 'Short note',
                  hintText: 'One sentence',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.bookmark_add_outlined),
                      label: const Text('Save place'),
                      onPressed: () => _savePlace(position),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text('Long-press elsewhere on the map to change the pin.'),
              const SizedBox(height: 8),
              // TODO: Add photo attachments in future release.
            ],
          ),
        );
      },
    );
  }

  Future<void> _savePlace(LatLng position) async {
    final note = _noteController.text.trim();
    if (note.isEmpty || note.length > 80) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Note must be 1-80 characters.')),
      );
      return;
    }

    final repo = ref.read(placeRepositoryProvider);
    final place = Place(
      latitude: position.latitude,
      longitude: position.longitude,
      emoji: _selectedEmoji,
      note: note,
      createdAt: DateTime.now(),
    );
    await repo.addPlace(place);
    if (!mounted) return;
    Navigator.of(context).pop();
    setState(() {
      _tempPin = null;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Place saved locally.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final position = _currentPosition;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Placebook'),
        actions: [
          IconButton(
            tooltip: 'Saved places',
            icon: const Icon(Icons.list_alt_outlined),
            onPressed: () => context.push('/places'),
          ),
        ],
      ),
      body: position == null
          ? const Center(child: CircularProgressIndicator())
          : GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(position.latitude, position.longitude),
                zoom: 14,
              ),
              myLocationButtonEnabled: true,
              myLocationEnabled: true,
              onMapCreated: (controller) {
                _mapController = controller;
              },
              markers: {
                if (_tempPin != null)
                  Marker(
                    markerId: const MarkerId('temp'),
                    position: _tempPin!,
                    infoWindow: const InfoWindow(title: 'New place'),
                  ),
              },
              onLongPress: _onLongPress,
            ),
      // TODO: Add app tutorial for new users.
    );
  }
}

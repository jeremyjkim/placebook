import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';

import '../model/place.dart';

class PlaceRepository {
  PlaceRepository(this._isar);

  static Future<Isar> init() async {
    final dir = await getApplicationDocumentsDirectory();
    return Isar.open([
      PlaceSchema,
    ], directory: dir.path);
  }

  final Isar _isar;

  IsarCollection<Place> get _collection => _isar.places;

  Future<Id> addPlace(Place place) async {
    return _isar.writeTxn(() => _collection.put(place));
  }

  Stream<List<Place>> watchPlaces() {
    return _collection.where().watch(fireImmediately: true).map((places) {
      final sorted = [...places];
      sorted.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return sorted;
    });
  }

  Future<Place?> getPlace(Id id) {
    return _collection.get(id);
  }
}

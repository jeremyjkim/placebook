import 'package:isar/isar.dart';

part 'place.g.dart';

@collection
class Place {
  Place({
    required this.latitude,
    required this.longitude,
    required this.emoji,
    required this.note,
    required this.createdAt,
  });

  Id id = Isar.autoIncrement;
  double latitude;
  double longitude;
  String emoji;
  String note;
  DateTime createdAt;
}

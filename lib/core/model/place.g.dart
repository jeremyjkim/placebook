// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place.dart';

// ***************************************************************************
// IsarCollectionGenerator
// ***************************************************************************

extension GetPlaceCollection on Isar {
  IsarCollection<Place> get places => this.collection<Place>();
}

const PlaceSchema = CollectionSchema(
  name: r'Place',
  id: -5447933823484925537,
  properties: {
    r'createdAt': PropertySchema(
      id: 0,
      name: r'createdAt',
      type: IsarType.dateTime,
    ),
    r'emoji': PropertySchema(
      id: 1,
      name: r'emoji',
      type: IsarType.string,
    ),
    r'latitude': PropertySchema(
      id: 2,
      name: r'latitude',
      type: IsarType.double,
    ),
    r'longitude': PropertySchema(
      id: 3,
      name: r'longitude',
      type: IsarType.double,
    ),
    r'note': PropertySchema(
      id: 4,
      name: r'note',
      type: IsarType.string,
    ),
  },
  estimateSize: _placeEstimateSize,
  serialize: _placeSerialize,
  deserialize: _placeDeserialize,
  deserializeProp: _placeDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {},
  embedded: false,
  version: '3.1.0+1',
);

int _placeEstimateSize(
  Place object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.emoji.length * 3;
  bytesCount += 3 + object.note.length * 3;
  return bytesCount;
}

void _placeSerialize(
  Place object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeDateTime(offsets[0], object.createdAt);
  writer.writeString(offsets[1], object.emoji);
  writer.writeDouble(offsets[2], object.latitude);
  writer.writeDouble(offsets[3], object.longitude);
  writer.writeString(offsets[4], object.note);
}

Place _placeDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = Place(
    latitude: reader.readDouble(offsets[2]),
    longitude: reader.readDouble(offsets[3]),
    emoji: reader.readString(offsets[1]),
    note: reader.readString(offsets[4]),
    createdAt: reader.readDateTime(offsets[0]),
  );
  object.id = id;
  return object;
}

P _placeDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readDateTime(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readDouble(offset)) as P;
    case 3:
      return (reader.readDouble(offset)) as P;
    case 4:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _placeGetId(Place object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _placeGetLinks(Place object) {
  return [];
}

void _placeAttach(IsarCollection<dynamic> col, Id id, Place object) {
  object.id = id;
}

extension PlaceQueryWhereSort on QueryBuilder<Place, Place, QWhere> {
  QueryBuilder<Place, Place, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension PlaceQueryWhere on QueryBuilder<Place, Place, QWhereClause> {
  QueryBuilder<Place, Place, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(lower: id, upper: id));
    });
  }
}

extension PlaceQueryFilter on QueryBuilder<Place, Place, QFilterCondition> {
  QueryBuilder<Place, Place, QAfterFilterCondition> emojiEqualTo(String value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'emoji',
        value: value,
      ));
    });
  }
}

extension PlaceQuerySortBy on QueryBuilder<Place, Place, QSortBy> {
  QueryBuilder<Place, Place, QAfterSortBy> sortByCreatedAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.desc);
    });
  }
}

extension PlaceQueryWhereDistinct on QueryBuilder<Place, Place, QDistinct> {}

extension PlaceQueryProperty on QueryBuilder<Place, Place, QQueryProperty> {
  QueryBuilder<Place, DateTime, QQueryOperations> createdAtProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'createdAt');
    });
  }
}

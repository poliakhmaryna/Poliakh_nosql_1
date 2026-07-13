use("spotify");

// Завдання 1. Треки для вечірки
print("===== ЗАВДАННЯ 1: Треки для вечірки =====");

db.tracks.find(
    {
        "audio_features.danceability": { $gt: 0.7 },
        "audio_features.energy": { $gt: 0.7 },
        duration_sec: {
            $gte: 180,
            $lte: 300
        }
    },
    {
        track_name: 1,
        artists: 1,
        popularity: 1,
        "audio_features.danceability": 1,
        "audio_features.energy": 1,
        duration_sec: 1
    }
)
.limit(10)
.forEach(printjson);


// Завдання 2. Виконавці, у яких усі треки популярні
print("----- Завдання 2 -----");
db.tracks.aggregate([
    {
        $unwind: "$artists"
    },
    {
        $group: {
            _id: "$artists",
            tracks_count: {
                $sum: 1
            },
            min_popularity: {
                $min: "$popularity"
            },
            avg_popularity: {
                $avg: "$popularity"
            }
        }
    },
    {
        $match: {
            tracks_count: {
                $gte: 3
            },
            min_popularity: {
                $gte: 60
            }
        }
    },
    {
        $project: {
            _id: 0,
            artist: "$_id",
            tracks_count: 1,
            min_popularity: 1,
            avg_popularity: {
                $round: [
                    "$avg_popularity",
                    1
                ]
            }
        }
    },
    {
        $sort: {
            avg_popularity: -1
        }
    },
    {
        $limit: 20
    }
]).forEach(printjson);


// Завдання 3. Нетипові треки
print("----- Завдання 3 -----");
db.tracks.aggregate([
    {
        $group: {
            _id: "$track_genre",
            avg_tempo: {
                $avg: "$audio_features.tempo"
            },
            std_tempo: {
                $stdDevPop: "$audio_features.tempo"
            },
            tracks: {
                $push: {
                    _id: "$_id",
                    track_name: "$track_name",
                    popularity: "$popularity",
                    artists: "$artists",
                    tempo: "$audio_features.tempo"
                }
            }
        }
    },
    {
        $addFields: {
            outlier_threshold: {
                $add: [
                    "$avg_tempo",
                    {
                        $multiply: [
                            "$std_tempo",
                            2
                        ]
                    }
                ]
            }
        }
    },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            avg_tempo: {
                $round: [
                    "$avg_tempo",
                    1
                ]
            },
            outlier_threshold: {
                $round: [
                    "$outlier_threshold",
                    1
                ]
            },
            outlier_tracks: {
                $filter: {
                    input: "$tracks",
                    as: "track",
                    cond: {
                        $gt: [
                            "$$track.tempo",
                            "$outlier_threshold"
                        ]
                    }
                }
            }
        }
    },
    {
        $match: {
            "outlier_tracks.0": {
                $exists: true
            }
        }
    }
]).forEach(printjson);


// Завдання 4. Треки для фонової роботи
print("----- Завдання 4 -----");
db.tracks.find(
    {
        "audio_features.loudness": {
            $lt: -10
        },
        "audio_features.speechiness": {
            $lt: 0.1
        },
        "audio_features.instrumentalness": {
            $gt: 0.5
        },
        explicit: false
    },
    {
        track_name: 1,
        artists: 1,
        track_genre: 1,
        popularity: 1,
        "audio_features.loudness": 1,
        "audio_features.speechiness": 1,
        "audio_features.instrumentalness": 1,
        explicit: 1
    }
)
.limit(10)
.forEach(printjson);
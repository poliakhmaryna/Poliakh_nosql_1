use("spotify");
print("----- Завдання 1 -----");
// Завдання 1. Топ-10 виконавців за середньою популярністю

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
            avg_popularity: {
                $avg: "$popularity"
            }
        }
    },
    {
        $match: {
            tracks_count: {
                $gte: 5
            }
        }
    },
    {
        $project: {
            _id: 0,
            artist: "$_id",
            avg_popularity: {
                $round: [
                    "$avg_popularity",
                    1
                ]
            },
            tracks_count: 1
        }
    },
    {
        $sort: {
            avg_popularity: -1
        }
    },
    {
        $limit: 10
    }
]).forEach(printjson);


print("----- Завдання 2 -----");
// Завдання 2. Розподіл треків за настроєм

db.tracks.aggregate([
    {
        $addFields: {
            mood: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $and: [
                                    {
                                        $gte: [
                                            "$audio_features.valence",
                                            0.5
                                        ]
                                    },
                                    {
                                        $gte: [
                                            "$audio_features.energy",
                                            0.5
                                        ]
                                    }
                                ]
                            },
                            then: "happy"
                        },
                        {
                            case: {
                                $and: [
                                    {
                                        $lt: [
                                            "$audio_features.valence",
                                            0.5
                                        ]
                                    },
                                    {
                                        $gte: [
                                            "$audio_features.energy",
                                            0.5
                                        ]
                                    }
                                ]
                            },
                            then: "angry"
                        },
                        {
                            case: {
                                $and: [
                                    {
                                        $gte: [
                                            "$audio_features.valence",
                                            0.5
                                        ]
                                    },
                                    {
                                        $lt: [
                                            "$audio_features.energy",
                                            0.5
                                        ]
                                    }
                                ]
                            },
                            then: "calm"
                        }
                    ],
                    default: "sad"
                }
            }
        }
    },
    {
        $group: {
            _id: "$mood",
            tracks_count: {
                $sum: 1
            }
        }
    },
    {
        $project: {
            _id: 0,
            mood: "$_id",
            tracks_count: 1
        }
    },
    {
        $sort: {
            tracks_count: -1
        }
    }
]).forEach(printjson);

print("----- Завдання 3 -----");
// Завдання 3. Найбільш «танцювальний» жанр

db.tracks.aggregate([
    {
        $group: {
            _id: "$track_genre",
            avg_danceability: {
                $avg: "$audio_features.danceability"
            },
            avg_energy: {
                $avg: "$audio_features.energy"
            },
            avg_valence: {
                $avg: "$audio_features.valence"
            },
            tracks_count: {
                $sum: 1
            }
        }
    },
    {
        $match: {
            tracks_count: {
                $gte: 100
            }
        }
    },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            avg_danceability: {
                $round: [
                    "$avg_danceability",
                    3
                ]
            },
            avg_energy: {
                $round: [
                    "$avg_energy",
                    3
                ]
            },
            avg_valence: {
                $round: [
                    "$avg_valence",
                    3
                ]
            },
            tracks_count: 1
        }
    },
    {
        $sort: {
            avg_danceability: -1
        }
    },
    {
        $limit: 10
    }
]).forEach(printjson);
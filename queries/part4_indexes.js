use("spotify");



print("----- Завдання 1 -----");
print("===== Explain ДО створення індексу =====");

let before = db.tracks.find({
    track_genre: "pop",
    "audio_features.danceability": {
        $gte: 0.7
    }
})
.sort({
    popularity: -1
})
.explain("executionStats");


print("Час виконання:", before.executionStats.executionTimeMillis, "ms");
print("Перевірено документів:", before.executionStats.totalDocsExamined);
print("Перевірено ключів індексу:", before.executionStats.totalKeysExamined);
print("План:", before.queryPlanner.winningPlan.stage);



// ================================
// СТВОРЕННЯ ІНДЕКСУ
// ================================

print("===== Створення індексу =====");

db.tracks.createIndex({
    track_genre: 1,
    "audio_features.danceability": 1,
    popularity: -1
});



// ================================
// ПІСЛЯ ІНДЕКСУ
// ================================

print("===== Explain ПІСЛЯ створення індексу =====");


let after = db.tracks.find({
    track_genre: "pop",
    "audio_features.danceability": {
        $gte: 0.7
    }
})
.sort({
    popularity: -1
})
.explain("executionStats");


print("Час виконання:", after.executionStats.executionTimeMillis, "ms");
print("Перевірено документів:", after.executionStats.totalDocsExamined);
print("Перевірено ключів індексу:", after.executionStats.totalKeysExamined);
print("План:", after.queryPlanner.winningPlan.stage);



// Завдання 2
// Індекс для пошуку музики для роботи
// ================================

print("----- Завдання 2 -----");

print("===== Explain ДО створення індексу (Завдання 2) =====");


let beforeWork = db.tracks.find({
    "audio_features.instrumentalness": {
        $gt: 0.5
    },
    "audio_features.speechiness": {
        $lt: 0.1
    },
    explicit: false
})
.explain("executionStats");


print("Час виконання:", beforeWork.executionStats.executionTimeMillis, "ms");
print("Перевірено документів:", beforeWork.executionStats.totalDocsExamined);
print("Перевірено ключів індексу:", beforeWork.executionStats.totalKeysExamined);
print("План:", beforeWork.queryPlanner.winningPlan.stage);



// Створення складеного індексу

print("===== Створення індексу =====");


db.tracks.createIndex({
    "audio_features.instrumentalness": 1,
    "audio_features.speechiness": 1,
    explicit: 1
});



// Перевірка після створення індексу

print("===== Explain ПІСЛЯ створення індексу (Завдання 2) =====");


let afterWork = db.tracks.find({
    "audio_features.instrumentalness": {
        $gt: 0.5
    },
    "audio_features.speechiness": {
        $lt: 0.1
    },
    explicit: false
})
.explain("executionStats");


print("Час виконання:", afterWork.executionStats.executionTimeMillis, "ms");
print("Перевірено документів:", afterWork.executionStats.totalDocsExamined);
print("Перевірено ключів індексу:", afterWork.executionStats.totalKeysExamined);
print("План:", afterWork.queryPlanner.winningPlan.stage);



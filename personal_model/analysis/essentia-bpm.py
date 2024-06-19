import essentia.standard as es

audio = es.MonoLoader(filename='filename.mp3')()

rhythm_extractor = es.RhythmExtractor2013(method="multifeature")
bpm, beats, beats_confidence, _, beats_intervals = rhythm_extractor(audio)

print(bpm)
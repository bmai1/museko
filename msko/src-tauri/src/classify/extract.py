from essentia.standard import MonoLoader, RhythmExtractor2013, KeyExtractor

def extract_features(file_path):
    audio = MonoLoader(filename=file_path)()

    # outdated
    # rhythm_extractor = RhythmExtractor()

    rhythm_extractor = RhythmExtractor2013(method="multifeature")
    key_extractor = KeyExtractor()

    bpm = round(rhythm_extractor(audio)[0], 2)
    key, scale, strength = key_extractor(audio)

    return [bpm, key, scale]
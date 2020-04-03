import librosa
import numpy as np
import json
import sys

def get_audio(url: str)->str:
    """
    gets sampling rate (per sec) and samples in jason

    Args:
        url: url for the audio file
    Returns:
        str the jason content
    """
    # first we get the file
    samples, sr = librosa.load(url)
    # normalise
    #samples /= np.amax(samples)
    print('sampling rate: ' , sr)
    print('samples: ' , samples.shape)
    obj = {
        'sampling_rate': sr,
        'samples': samples.tolist()
    }
    # then we convert to js format
    json_obj = json.dumps(obj)
    return json_obj

def write_to_file(url, json)->None:
    """
    Writes json to a js file
    Args:
        url: the url of the file to write to
        json: the json to add to the file
    Returns: None
    """
    with open(url, 'w') as file:
        file.write(json)

if __name__ == '__main__':
    print('getting json from audio file...')
    name = sys.argv[1]
    json = get_audio('res/mus/{}.wav'.format(name))
    print('got json, writing to file...')
    write_to_file('res/mus/{}_data.json'.format(name), json)

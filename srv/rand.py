#!/usr/python3.5
import numpy as np
import math

def random(arr: np.ndarray) -> float:
    """
        Returns a pseudo random number based on seed vector
        Args:
            arr ndarray of shape [1, 2]
        Returns:
            float
    """
    seed = np.array([12.9898, 78.233])
    rand = math.sin(arr @ seed) * 43758.5453
    return math.modf(rand)

if __name__ == '__main__':
    for x in range(3):
        # get random int np array
        array = np.random.randint(0, 10, size=(1, 2))
        np.set_printoptions(precision=3, suppress=True)
        print('seed vector is: ' , array)
        print('pseudo-random number {}: {}'.format(x, random(array)[0]))

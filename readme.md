# The Shakingway Test

Ernest Hemingway and William Shakespeare have collaborated on writing a novel, each of them writing one or more lines, then passing the manuscript on to the other. Your task is to figure out which lines have been written by whom. Only those getting it right will be deemed worthy of entering!

## How it works

The [ml5js LSTM text generator](https://ml5js.org/docs/LSTMGenerator) is used with two pre-trained models, one trained on the works of Hemingway, the other on the works of Shakespeare. Repeatedly, one of them is randomly chosen to generate a line of text, using the previous line as the seed text, so that the lines form more or less contiguous sentences. A relatively high temperature parameter is used so that actual English words and phrases are generated.

## Speculative use for authentication

If one of the two models were trained on text written by the user, the task for the user would become to decide “Would I have written this line?”. This task is more easily done by the respective user themselves than by an attacker who is not intimately familiar with them, thus leading to a way of authenticating the user.

Obviously the current implementation is not suitable for secure authentication, since with only 10 bits of information in the response from the user, it is easily brute-forced.

## Implementation notes

* The [Shakespeare LSTM model](https://github.com/ml5js/ml5-data-and-training/tree/98de6599693e870afb0d53198b2585e3da5aed0b/models/lstm/shakespeare) has the [peculiarity](https://github.com/ml5js/ml5-data-and-training/issues/28) of generating two space characters `  ` where it should generate a `u` character. The code attempts to correct this, but there is no unique solution where a `u` occurs at the beginning or end of a word (three consecutive spaces in the generated text), which means that cases where the `u` should occur at the beginning of a word are miscorrected.
* When run in Safari 11, the generators produce unintelligible text. It seems like the temperature parameter is interpreted with a different scale there.

## Author

Developed by Christian Walther <cwalther@gmx.ch> during a workshop on [Machine Learning for Creatives](https://muda.co/stream/supsiws.php) by [Matteo Loglio](https://matlo.me), 2018-07-01.

[Public Domain](https://creativecommons.org/publicdomain/zero/1.0/): To the extent possible under law, the author has waived all copyright and related or neighboring rights to this work.

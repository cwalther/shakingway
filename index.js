// The Shakingway Test
// Christian Walther <cwalther@gmx.ch> 2018
// Public Domain

let lstm1 = null;
let lstm2 = null;
let sequence = [];

function generate() {
    // clear the previous lines
    let el = document.getElementById('lines');
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    document.getElementById('progress').textContent = "…";
    document.getElementById('progress').classList.remove('hidden');
    document.getElementById('btnGo').classList.add('hidden');
    document.getElementById('status').classList.add('hidden');
    sequence = [];

    // initial seed text
    let seed = Promise.resolve('a');
    // generate 11 lines of text by chaining promises, feeding the output of one
    // iteration into the next as the new seed text
    for (let i = 0; i < 11; i++) {
        seed = seed.then(line => new Promise((resolve, reject) => {
            let choice = Math.floor(2 * Math.random());
            sequence.push(choice);
            ([lstm1, lstm2][choice]).generate({seed: line, length: 50, temperature: 0.8}, result => {
                // for some reason the Shakespeare model produces two spaces instead of a 'u'
                // (this replacement doesn't properly fix it if a word starts with 'u' but it's the best we can do)
                line = result.generated.replace(/  /g, 'u').replace(/\n/, ' ');
                // the generated text usually ends in the middle of a word, trim it to the last word boundary
                line = line.substr(0, line.lastIndexOf(' ') + 1);
                // pass the line to the next iteration
                resolve(line);
                // output the line into the document
                // ignore the first line because it starts with gibberish due to the too short initial seed text
                if (i !== 0) {
                    let row = document.createElement('tr');
                    let el = document.createElement('td');
                    el.classList.add('col1');
                    el.textContent = line;
                    //el.setAttribute('title', choice);
                    row.appendChild(el);
                    el = document.createElement('td');
                    el.classList.add('col2');
                    el.innerHTML = '<input type="radio" name="r' + i + '" value="0">';
                    row.appendChild(el);
                    el = document.createElement('td');
                    el.classList.add('col2');
                    el.innerHTML = '<input type="radio" name="r' + i + '" value="1">';
                    row.appendChild(el);
                    document.getElementById('lines').appendChild(row);
                }
            })
        }));
    }
    // when the final line is done, show the Go button
    seed.then(() => {
        //console.log(sequence);
        document.getElementById('progress').classList.add('hidden');
        document.getElementById('btnGo').classList.remove('hidden');
    });
}

// Wrap everything in promises to deal with the asynchronous APIs more easily. This
// would have been easier if the ml5.js API were promise-based in the first place.
// Load the two LSTM models concurrently and wait until both are ready. Also, we
// can't do DOM manipulations until the document is loaded, so wait for that as well.
Promise.all([
    new Promise((resolve, reject) => {
        lstm1 = ml5.LSTMGenerator('lstm/hemingway', resolve);
    }),
    new Promise((resolve, reject) => {
        lstm2 = ml5.LSTMGenerator('lstm/shakespeare', resolve);
    }),
    new Promise((resolve, reject) => {
        window.onload = resolve;
    }).then(() => {
        document.getElementById('progress').textContent = "loading model…";
    })
]).then(() => {
    // set event handlers on the two buttons
    document.getElementById('btnGo').onclick = () => {
        let statusElement = document.getElementById('status');
        // check the user's input against the stored sequence
        for (let i = 1; i < sequence.length; i++) {
            if (parseInt(document.getElementById('form')['r' + i].value) !== sequence[i]) {
                statusElement.textContent = 'fail';
                statusElement.classList.add('failure');
                statusElement.classList.remove('success');
                statusElement.classList.remove('hidden');
                return;
            }
        }
        document.getElementById('status').textContent = "success";
        statusElement.classList.remove('failure');
        statusElement.classList.add('success');
        statusElement.classList.remove('hidden');
    };
    document.getElementById('btnGenerate').onclick = generate;
    // start the first generation
    generate();
});

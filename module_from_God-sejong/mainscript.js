import { addJongsung } from './addJongsung.js';
import { addJunk } from './addJunk.js';
import { addPraise } from './addPraise.js'; // pre-engine
import { cambridge } from './cambridge.js';
import { yamin } from './yamin.js'
import { is_hangul, is_word_hangul } from './process-hangul.js';
let punctuations = ['.', ',', '!', '?', ';', '\n']

export function convert_text(value) {
    var input = value
    var sentence_pos = [0]

    var is_punc = false
    for (var i = 0; i < input.length; i++) {
        if (i == input.length - 1) {
            sentence_pos.push(i + 1)
            break
        }

        if (punctuations.includes(input[i])) {
            is_punc = true
            continue
        }

        if (is_punc === true && input[i] != ' ') {
            sentence_pos.push(i)
            is_punc = false
            continue
        }

    }

    //slice string
    var sentences = []
    for (var i = 0; i < sentence_pos.length - 1; i++) {
        sentences.push(input.slice(sentence_pos[i], sentence_pos[i + 1]))
    }

    //import engines
    var engines = []
    var engine_list = [
        addJongsung,
        addJunk,
        yamin,
        cambridge
    ]
    for (var engine of engine_list) {
        if (Math.round(Math.random())) {
            engines.push(engine)
        }
    }

    if (engines.length === 0) {
        engines.push(yamin)
    }

    //main processing
    var sequence = randomize(sentences.length, engines)
    var new_sentence = ''
    for (var i = 0; i < sentences.length; i++) {
        new_sentence += convert_sentence(sentences[i], sequence[i])
    }

    //post processing
    var p_engines = []
    var p_engine_list = [addPraise]
    for (var engine of p_engine_list) {
        if (Math.round(Math.random()))
            p_engines.push(engine)
    }

    for (var i = 0; i < p_engines.length; i++) {
        new_sentence = p_engines[i](new_sentence)
    }

    //display
    return new_sentence
}


//number of sentence
function randomize(nos, engines) {
    var sequence = []
    while (nos > 0) {
        nos = nos - engines.length
        sequence = sequence.concat(engines.sort(function () { return 0.5 - Math.random() }))
    }

    return sequence
}

function convert_sentence(sentence, engine) {
    var strings = sentence.split(' ')
    var new_strings = []
    for (var i = 0; i < strings.length; i++) {
        new_strings.push(convert_word(strings[i], engine));
    }

    return new_strings.join(' ')
}

function convert_word(word, engine) {    //save punctuations and only call hangul
    var new_word = []
    var index = 0

    for (var i = 0; i < word.length; i++) {
        if (is_hangul(word[i])) {
            if (!new_word[index])
                new_word.push(word[i])
            else
                new_word[index] += word[i]
        }
        else {
            index++
            new_word.push(word[i])
            index++
        }
    }

    for (var i = 0; i < new_word.length; i++) {
        if (is_word_hangul(new_word[i])) {
            new_word[i] = engine(new_word[i])
        }
    }

    return new_word.join('')
}


/* note */
/*
숫자를 한글로 바꾸기?

*/
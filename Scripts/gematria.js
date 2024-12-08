//This function turns any hebrew word into a gamatria number
function countGamatria(user_word) {
    const map = new Map();
    map.set("א", 1);
    map.set("ב", 2);
    map.set("ג",3);
    map.set("ד", 4);
    map.set("ה", 5);
    map.set("ו", 6);
    map.set("ז", 7);
    map.set("ח", 8);
    map.set("ט", 9);
    map.set("י", 10);
    map.set("כ", 20);
    map.set("ך",20);
    map.set("ל", 30);
    map.set("מ", 40);
    map.set("ם", 40);
    map.set("נ", 50);
    map.set("ן",50);
    map.set("ס",60);
    map.set("ע", 70);
    map.set("פ", 80);
    map.set("צ",90);
    map.set("ץ", 90);
    map.set("ק", 100);
    map.set("ר", 200);
    map.set("ש", 300);
    map.set("ת", 400);
    //let array = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"];
    //let array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]
    //let element = 0;
    let value = 0;
    let gamatria = 0;
    for (const letter of user_word) {
        gamatria += map.get(letter);
    }

    //console.log(user_word + " --> "+gamatria);
    return (gamatria);
}

// This function prompt the user to enter a text they want
function countText(user_text, gematria) {
    const map2 = new Map();
    let output = document.getElementById("found");
    let j = 0;
    let phrase = "";
    let originalPhrase = "";
    let originalGematria = gematria;
    let words2 = user_text.split(" ");
    let x = 0;
    for (let i = 0; i < words2.length; i++) {
        let tempPhrase = ""; // the phrase I am constructing right now

        for (const word of words2) {
            if (gematria >= countGamatria(word)) {
                let wordGematria = countGamatria(word);
                gematria -= wordGematria;
                tempPhrase += word + " "; //" (" + wordGematria + ") ";
                if (gematria == 0) {
                    if(!map2.has(tempPhrase)){
                        map2.set(tempPhrase, x);
                        phrase += tempPhrase + "\n"; // record the temporary phrase
                    }
                    gematria = originalGematria;
                    break;
                }
            } else {
                gematria = originalGematria;
                break;
            }
        }
        words2 = words2.slice(1);
    }
    output.value += phrase + "\nALL DONE!";
}

const testLogic = (targetWord, guessWord) => {
    const guessChars = guessWord.split('');
    const targetChars = targetWord.split('');
    const letterStatus = new Array(5).fill('gray');
    const targetCounts = {};

    targetChars.forEach(char => {
        targetCounts[char] = (targetCounts[char] || 0) + 1;
    });

    guessChars.forEach((char, index) => {
        if (char === targetChars[index]) {
            letterStatus[index] = 'green';
            targetCounts[char]--;
        }
    });

    guessChars.forEach((char, index) => {
        if (letterStatus[index] !== 'green' && targetCounts[char] > 0) {
            letterStatus[index] = 'yellow';
            targetCounts[char]--;
        }
    });

    console.log(`Target: ${targetWord}, Guess: ${guessWord} -> ${letterStatus.join(', ')}`);
}

testLogic('ABBEY', 'BABES'); // Expect: Y Y G G Gray
testLogic('ABCDE', 'AAXYZ'); // Expect: G Gray Gray Gray Gray
testLogic('AABDE', 'AAXYZ'); // Expect: G G Gray Gray Gray
testLogic('SASSY', 'SSSSY'); // Expect: G Gray G G G

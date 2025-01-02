const convertToBanglaNumber =(englishNumber) => {
    return englishNumber
        .toString() // Ensure the input is treated as a string
        .replace(/\d/g, (match) => String.fromCharCode(0x09E6 + parseInt(match))); // Replace each digit with the corresponding Bangla digit
}
export default convertToBanglaNumber;
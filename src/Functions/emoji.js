function removeEmoji(input, includeBasic) {
    if (typeof includeBasic == "undefined")
            includeBasic = true;

        for (var c of input) {
            var cHex = ("" + c)?.codePointAt(0)?.toString(16) 
            var lHex = cHex.length;
            if (lHex > 3) {

                var prefix = cHex.substring(0, 2);

                if (lHex == 5 && prefix == "1f") {
                    return true;
                }

                if (includeBasic && lHex == 4) {
                    if (["20", "21", "23", "24", "25", "26", "27", "2B", "29", "30", "32"].indexOf(prefix) > -1)
                        return true;
                }
            }
        }
        return false;
}

module.exports = {
    removeEmoji
}

//totally didn't steal this from stackoverflow
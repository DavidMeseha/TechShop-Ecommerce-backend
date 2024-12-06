"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
exports.responseDto = responseDto;
exports.validateAttributes = validateAttributes;
exports.generateVariants = generateVariants;
function responseDto(response, success = false, page) {
    if (page && success)
        return {
            data: response,
            pages: {
                current: page.current,
                limit: page.limit,
                hasNext: page.hasNext,
            },
        };
    else if (success)
        return {
            data: response,
        };
    else
        return {
            message: response,
        };
}
function validateAttributes(selected, product) {
    const requiredAttributes = product.map((attribute) => String(attribute._id));
    const providedAttributes = selected.map((attribute) => attribute._id);
    const missingAttributes = requiredAttributes.filter((attribute) => !providedAttributes.includes(attribute));
    if (missingAttributes.length > 0) {
        throw new Error(`Missing required attributes`);
    }
    return true;
}
const delay = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
};
exports.delay = delay;
function generateVariants(query, n) {
    let queryRegex = "";
    function replaceChars(currentIndex, indicesToReplace) {
        // If we have selected n indices, create the variant
        if (indicesToReplace.length === n) {
            let variant = query;
            for (let index of indicesToReplace) {
                variant = variant.replace(variant[index], ".");
            }
            queryRegex += variant + "|";
            return;
        }
        // Iterate through the query string to find indices to replace
        for (let i = currentIndex; i < query.length; i++) {
            // Add the current index to the list of indices to replace
            replaceChars(i + 1, [...indicesToReplace, i]);
        }
    }
    // Start the recursive function
    replaceChars(0, []);
    // Remove the trailing "|" if necessary
    if (queryRegex.endsWith("|")) {
        queryRegex = queryRegex.slice(0, -1);
    }
    return queryRegex;
}

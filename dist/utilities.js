"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseDto = responseDto;
exports.validateAttributes = validateAttributes;
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (path) => {
    const index = path.lastIndexOf(`.`);
    return index !== -1 ? path.substring(index + 1, path.length).toLowerCase() : ``;
};
//# sourceMappingURL=fileType.js.map
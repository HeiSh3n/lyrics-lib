"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./LyricsLibError.js"), exports);
__exportStar(require("./RequestError.js"), exports);
__exportStar(require("./NotFoundError.js"), exports);
__exportStar(require("./NotImplementedError.js"), exports);
// Deprecated v1.x shims — kept in the public surface for source
// compatibility. No removal planned.
__exportStar(require("./KeyError.js"), exports);
__exportStar(require("./NoResultError.js"), exports);
//# sourceMappingURL=index.js.map
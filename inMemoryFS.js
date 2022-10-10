/**
 *@type {Object.<string, string>}
 */
const inMemoryRepo = {};

module.exports = {
    addFile : function (/**@type string*/ fullPath, /**@type string*/ content) {
        inMemoryRepo[fullPath] = content;
    },    
    readFile : function (/**@type string*/ fullPath) {
        return inMemoryRepo[fullPath];
    }
}
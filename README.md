# PreTSC

The aim of this project is 
- To enable running any arbitrary pre-build step before invoking typescript compiler (tsc).
- The pre-build step should be able to modify/add the typescript files to be compiled without requiring to write those files to disk (and thus creating issues with version control).
- The pre-build step should also be able to modify any other file type, for e.g. an included JS file
- The project should be a drop-in replacement for the TSC compiler 
- The project should take care not to introduce any hard dependency on a particular typescript version 

By integrating this project in the build tool chain, a variety of use cases can become viable. For e.g.
- Conditional compilation (pre-build step can be written to remove conditional code on the basis of env the build is running on)
- Compile time decorators (pre-build step can be written to replace compile time decorator placeholders with some real typescript code dynamically generated on the basis of decorator position and parameters)
-- 'nameOf' operator anyone?
-- Logging framework (pre-build step can be written to inject required logger tied to current class name)
- Dependency injection framework (pre-build step can be written to parse typescript files and dump meta information about the interfaces to a separate json file. This json file can then be used by a decorator (e.g. @inject) to inject concrete implementations in place of the mentioned interface)
- And many more...Please feel free to add more use cases if you come across any

## How to use
- Add npm devdependency on "pretsc"
- Add a dependency/devdependency on "typescript"
- Add in the working directory from where you invoke the build chain a file name ".tscPreBuildHook.js".
    - ```JavaScript
        module.exports = function (inMemoryFS) {
            //Use typescript compiler api or any other means to discover the files to be compiled and modified. 
            //For e.g.
            const ts = require("typescript");
            const tsConfig = ts.getParsedCommandLineOfConfigFile(path.resolve("tsconfig.json"), {}, ts.sys);
            const program = ts.createProgram(tsConfig.fileNames, tsConfig.options);
            program.getSourceFiles().forEach((sfNode) => {
                const modifiedContent = ...//process the file
                if(modifiedContent) {
                    //tell pretsc to use the modified content instead of the original file from disk
                    inMemoryFS.addFile(sfNode.fileName, modifiedContent);
                }
            }
        }
    `
- In your build tool chain instead of invoking tsc, invoke pretsc passing the exact same arguments as you would have passed to tsc

# Note 1: In the first cut I will not support tsc watch mode
# Note 2: I am open to suggestions on the api front and implementation in general

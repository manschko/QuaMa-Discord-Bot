import fs, {Dirent} from "fs";

function getFiles(suffix: string, path: string) {
    const files: Dirent[] = fs.readdirSync(path, {withFileTypes: true});

    let CommandFiles: string[] = [];

    for (const file of files) {
        if( file.isDirectory()) {
            let test = getFiles(suffix, path + "/" + file.name);
            CommandFiles = CommandFiles.concat(test);
        } else if (file.name.endsWith(suffix)) {
            CommandFiles.push(path + "/" + file.name);
        }
    }
    return CommandFiles;
}

export default getFiles;
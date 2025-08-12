const fs = require('fs');
const path = require('path');

const project = process.argv.slice(2)[0];

const srcDir = path.resolve(__dirname, '../dist');
const destDir = path.resolve(__dirname, `../dist/${project}`);

// 确保目标目录存在
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 移动 HTML 文件
fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.includes('.html')) {
            const srcFile = path.join(srcDir, file);
            const destFile = path.join(destDir, file);

            fs.rename(srcFile, destFile, err => {
                if (err) {
                    console.error('Error moving file:', err);
                } else {
                    console.log(`Moved ${srcFile} to ${destFile}`);
                }
            });
        }
    });
});
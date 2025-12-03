const fs = require('fs');
const path = require('path');

// Tên file kết quả sẽ được tạo ra
const OUTPUT_FILE = 'toan_bo_source_code.txt';

// Các thư mục và file cần BỎ QUA (Rất quan trọng)
const IGNORE_LIST = [
    'node_modules', '.git', '.env', 'package-lock.json', 
    'scan_project.js', 'dist', 'build', 'uploads', '.DS_Store'
];

// Các đuôi file muốn đọc (Chỉ lấy file code)
const ALLOWED_EXTENSIONS = ['.js', '.json', '.css', '.html', '.jsx', '.env.example'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        
        // Bỏ qua nếu nằm trong danh sách loại trừ
        if (IGNORE_LIST.includes(file)) return;

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            // Chỉ lấy các file có đuôi cho phép
            const ext = path.extname(file);
            if (ALLOWED_EXTENSIONS.includes(ext)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

function mergeFiles() {
    const rootDir = __dirname; // Thư mục hiện tại
    const allFiles = getAllFiles(rootDir, []);
    
    let content = "";

    console.log(`Đang quét ${allFiles.length} file...`);

    allFiles.forEach(filePath => {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(rootDir, filePath);
            
            // Tạo vách ngăn giữa các file để AI dễ đọc
            content += `\n\n${'='.repeat(50)}\n`;
            content += `FILE_PATH: ${relativePath}\n`;
            content += `${'='.repeat(50)}\n`;
            content += fileContent;
        } catch (err) {
            console.error(`Lỗi đọc file ${filePath}:`, err.message);
        }
    });

    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(`✅ Xong! Đã tạo file "${OUTPUT_FILE}". Hãy gửi file này cho AI.`);
}

mergeFiles();
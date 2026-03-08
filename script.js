class EmojiBackgroundGenerator {
    constructor() {
        this.uploadInput = document.getElementById('image-upload');
        this.colorPicker = document.getElementById('color-picker');
        this.applyColorBtn = document.getElementById('apply-color');
        this.downloadAllBtn = document.getElementById('download-all');
        this.previewContainer = document.getElementById('preview-container');
        this.widthInput = document.getElementById('width-input');
        this.heightInput = document.getElementById('height-input');
        this.applySizeBtn = document.getElementById('apply-size');
        this.images = [];
        this.initEventListeners();
        this.loadSavedSettings();
    }
    
    initEventListeners() {
        // 图片上传处理
        this.uploadInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });
        
        // 拖放上传
        const uploadLabel = document.querySelector('.upload-label');
        uploadLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '#0071e3';
            uploadLabel.style.backgroundColor = '#f0f7ff';
        });
        
        uploadLabel.addEventListener('dragleave', () => {
            uploadLabel.style.borderColor = '#d1d1d6';
            uploadLabel.style.backgroundColor = '#fafafa';
        });
        
        uploadLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '#d1d1d6';
            uploadLabel.style.backgroundColor = '#fafafa';
            if (e.dataTransfer.files.length > 0) {
                this.handleImageUpload(e.dataTransfer.files);
            }
        });
        
        // 应用颜色
        this.applyColorBtn.addEventListener('click', () => {
            this.applyColorToAll();
        });
        
        // 下载所有图片
        this.downloadAllBtn.addEventListener('click', () => {
            this.downloadAllImages();
        });
        
        // 应用大小
        this.applySizeBtn.addEventListener('click', () => {
            this.applySizeToAll();
        });
        
        // 保存设置
        this.widthInput.addEventListener('change', () => {
            this.saveSettings();
        });
        
        this.heightInput.addEventListener('change', () => {
            this.saveSettings();
        });
    }
    
    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.processImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    loadSavedSettings() {
        const savedSettings = localStorage.getItem('emojiGeneratorSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (settings.width) {
                this.widthInput.value = settings.width;
            }
            if (settings.height) {
                this.heightInput.value = settings.height;
            }
            if (settings.color) {
                this.colorPicker.value = settings.color;
            }
        }
    }
    
    saveSettings() {
        const settings = {
            width: parseInt(this.widthInput.value) || 200,
            height: parseInt(this.heightInput.value) || 200,
            color: this.colorPicker.value
        };
        localStorage.setItem('emojiGeneratorSettings', JSON.stringify(settings));
    }
    
    processImage(imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 使用保存的大小或默认值
            const width = parseInt(this.widthInput.value) || 200;
            const height = parseInt(this.heightInput.value) || 200;
            canvas.width = width;
            canvas.height = height;
            
            // 整张排布图片（拉伸填充）
            ctx.drawImage(img, 0, 0, width, height);
            
            // 应用颜色覆盖
            this.applyColorToImage({ img, canvas, ctx, previewImg: null });
            
            // 创建预览项
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const previewImg = document.createElement('img');
            previewImg.src = canvas.toDataURL();
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = '下载';
            downloadBtn.addEventListener('click', () => {
                this.downloadImage(canvas, `emoji_${Date.now()}.png`);
            });
            
            previewItem.appendChild(previewImg);
            previewItem.appendChild(downloadBtn);
            this.previewContainer.appendChild(previewItem);
            
            // 存储图片信息
            this.images.push({
                img,
                canvas,
                ctx,
                previewItem,
                previewImg
            });
        };
        img.src = imageUrl;
    }
    
    applySizeToAll() {
        this.images.forEach(imageInfo => {
            this.updateImageSize(imageInfo);
        });
        this.saveSettings();
    }
    
    updateImageSize(imageInfo) {
        const { img, canvas, ctx, previewImg } = imageInfo;
        const width = parseInt(this.widthInput.value) || 200;
        const height = parseInt(this.heightInput.value) || 200;
        
        // 更新Canvas大小
        canvas.width = width;
        canvas.height = height;
        
        // 整张排布图片（拉伸填充）
        ctx.drawImage(img, 0, 0, width, height);
        
        // 重新应用颜色覆盖
        this.applyColorToImage({ img, canvas, ctx, previewImg });
    }
    
    applyColorToAll() {
        const color = this.colorPicker.value;
        this.images.forEach(imageInfo => {
            this.applyColorToImage(imageInfo, color);
        });
    }
    
    applyColorToImage(imageInfo, color) {
        const { canvas, ctx, previewImg } = imageInfo;
        
        // 获取颜色RGB值
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // 获取图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 遍历所有像素，替换颜色（保留透明度）
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha > 0) { // 只处理非透明像素
                data[i] = r;     // 红色通道
                data[i + 1] = g; // 绿色通道
                data[i + 2] = b; // 蓝色通道
                // 保持原始透明度
            }
        }
        
        // 把修改后的数据放回Canvas
        ctx.putImageData(imageData, 0, 0);
        
        // 更新预览
        if (previewImg) {
            previewImg.src = canvas.toDataURL();
        }
        
        // 保存颜色设置
        this.saveSettings();
    }
    
    downloadImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    downloadAllImages() {
        this.images.forEach((imageInfo, index) => {
            this.downloadImage(imageInfo.canvas, `emoji_${index + 1}.png`);
        });
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    new EmojiBackgroundGenerator();
});
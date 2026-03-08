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
            
            // 绘制背景
            ctx.fillStyle = this.colorPicker.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 绘制图片（保持透明度，居中显示）
            ctx.globalCompositeOperation = 'source-atop';
            const scale = Math.min(width / img.width, height / img.height, 1);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (width - scaledWidth) / 2;
            const y = (height - scaledHeight) / 2;
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            // 重置合成模式
            ctx.globalCompositeOperation = 'source-over';
            
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
        
        // 绘制背景
        ctx.fillStyle = this.colorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图片（保持透明度，居中显示）
        ctx.globalCompositeOperation = 'source-atop';
        const scale = Math.min(width / img.width, height / img.height, 1);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // 重置合成模式
        ctx.globalCompositeOperation = 'source-over';
        
        // 更新预览
        previewImg.src = canvas.toDataURL();
    }
    
    applyColorToAll() {
        const color = this.colorPicker.value;
        this.images.forEach(imageInfo => {
            this.applyColorToImage(imageInfo, color);
        });
    }
    
    applyColorToImage(imageInfo, color) {
        const { img, canvas, ctx, previewImg } = imageInfo;
        
        // 清空Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制新背景
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图片（保持透明度，居中显示）
        ctx.globalCompositeOperation = 'source-atop';
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // 重置合成模式
        ctx.globalCompositeOperation = 'source-over';
        
        // 更新预览
        previewImg.src = canvas.toDataURL();
        
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
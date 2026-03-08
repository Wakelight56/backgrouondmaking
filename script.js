class EmojiBackgroundGenerator {
    constructor() {
        this.uploadInput = document.getElementById('image-upload');
        this.colorPicker = document.getElementById('color-picker');
        this.applyColorBtn = document.getElementById('apply-color');
        this.backgroundPicker = document.getElementById('background-picker');
        this.applyBackgroundBtn = document.getElementById('apply-background');
        this.downloadAllBtn = document.getElementById('download-all');
        this.previewContainer = document.getElementById('preview-container');
        this.widthInput = document.getElementById('width-input');
        this.heightInput = document.getElementById('height-input');
        this.applySizeBtn = document.getElementById('apply-size');
        this.layoutBtns = document.querySelectorAll('.layout-btn');
        this.tiltInput = document.getElementById('tilt-input');
        this.tiltValue = document.getElementById('tilt-value');
        this.imageSizeInput = document.getElementById('image-size-input');
        this.imageSizeValue = document.getElementById('image-size-value');
        this.currentColumns = 2; // 默认2列
        this.currentTilt = 0; // 默认倾斜度
        this.currentImageSize = 50; // 默认素材大小（百分比）
        this.currentBackground = '#f0f8ff'; // 默认背景色
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
        
        // 排列按钮点击事件
        this.layoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const columns = parseInt(btn.dataset.columns);
                this.currentColumns = columns;
                this.updateLayoutButtons();
                this.applyLayoutToAll();
                this.saveSettings();
            });
        });
        
        // 倾斜度调整事件
        this.tiltInput.addEventListener('input', () => {
            this.currentTilt = parseInt(this.tiltInput.value);
            this.tiltValue.textContent = `${this.currentTilt}°`;
            this.applyLayoutToAll();
            this.saveSettings();
        });
        
        // 背景色应用事件
        this.applyBackgroundBtn.addEventListener('click', () => {
            this.currentBackground = this.backgroundPicker.value;
            this.applyLayoutToAll();
            this.saveSettings();
        });
        
        // 素材大小调整事件
        this.imageSizeInput.addEventListener('input', () => {
            this.currentImageSize = parseInt(this.imageSizeInput.value);
            this.imageSizeValue.textContent = `${this.currentImageSize}%`;
            this.applyLayoutToAll();
            this.saveSettings();
        });
    }
    
    handleImageUpload(files) {
        console.log('收到上传文件数量:', files.length);
        Array.from(files).forEach(file => {
            console.log('处理文件:', file.name, '类型:', file.type, '大小:', file.size);
            if (file.type.startsWith('image/')) {
                console.log('文件是图片，开始读取');
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log('文件读取完成，开始处理');
                    this.processImage(e.target.result);
                };
                reader.onerror = (error) => {
                    console.error('文件读取失败:', error);
                    alert('文件读取失败，请尝试上传其他图片');
                };
                reader.readAsDataURL(file);
            } else {
                console.log('文件不是图片，跳过:', file.name);
            }
        });
    }
    
    updateLayoutButtons() {
        this.layoutBtns.forEach(btn => {
            if (parseInt(btn.dataset.columns) === this.currentColumns) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
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
            if (settings.background) {
                this.currentBackground = settings.background;
                this.backgroundPicker.value = this.currentBackground;
            }
            if (settings.columns) {
                this.currentColumns = settings.columns;
            }
            if (settings.tilt) {
                this.currentTilt = settings.tilt;
                this.tiltInput.value = this.currentTilt;
                this.tiltValue.textContent = `${this.currentTilt}°`;
            }
            if (settings.imageSize) {
                this.currentImageSize = settings.imageSize;
                this.imageSizeInput.value = this.currentImageSize;
                this.imageSizeValue.textContent = `${this.currentImageSize}%`;
            }
        }
        this.updateLayoutButtons();
    }
    
    saveSettings() {
        const settings = {
            width: parseInt(this.widthInput.value) || 200,
            height: parseInt(this.heightInput.value) || 200,
            color: this.colorPicker.value,
            background: this.currentBackground,
            columns: this.currentColumns,
            tilt: this.currentTilt,
            imageSize: this.currentImageSize
        };
        localStorage.setItem('emojiGeneratorSettings', JSON.stringify(settings));
    }
    
    processImage(imageUrl) {
        console.log('开始处理图片:', imageUrl.substring(0, 50) + '...');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            try {
                console.log('图片加载成功，尺寸:', img.width, 'x', img.height);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 使用保存的大小或默认值
                const width = parseInt(this.widthInput.value) || 200;
                const height = parseInt(this.heightInput.value) || 200;
                canvas.width = width;
                canvas.height = height;
                console.log('创建Canvas，尺寸:', width, 'x', height);
                
                // 1. 填充背景色
                ctx.fillStyle = this.currentBackground;
                ctx.fillRect(0, 0, width, height);
                
                // 2. 先创建一个临时Canvas来处理原始图片
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                tempCtx.drawImage(img, 0, 0);
                
                // 3. 应用颜色覆盖到原始图片（使用用户选择的颜色）
                const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const tempData = tempImageData.data;
                const color = this.colorPicker.value;
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                
                for (let i = 0; i < tempData.length; i += 4) {
                    const alpha = tempData[i + 3];
                    if (alpha > 0) {
                        tempData[i] = r;     // 红色通道
                        tempData[i + 1] = g; // 绿色通道
                        tempData[i + 2] = b; // 蓝色通道
                        // 保持原始透明度
                    }
                }
                tempCtx.putImageData(tempImageData, 0, 0);
                
                // 4. 根据列数排列表情符号
                this.drawEmojisInGrid(ctx, tempCanvas, width, height, this.currentColumns);
                
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
                console.log('预览项创建成功');
                
                // 存储图片信息
                this.images.push({
                    img,
                    canvas,
                    ctx,
                    previewItem,
                    previewImg
                });
                console.log('图片处理完成，当前图片数量:', this.images.length);
            } catch (error) {
                console.error('图片处理失败:', error);
                alert('图片处理失败，请尝试上传其他图片');
            }
        };
        
        img.onerror = (error) => {
            console.error('图片加载失败:', error);
            alert('图片加载失败，请尝试上传其他图片');
        };
        
        img.src = imageUrl;
    }
    
    applySizeToAll() {
        this.images.forEach(imageInfo => {
            this.updateImageSize(imageInfo);
        });
        this.saveSettings();
    }
    
    drawEmojisInGrid(ctx, emojiCanvas, width, height, columns) {
        // 计算基础表情大小
        const baseEmojiSize = Math.min(emojiCanvas.width, emojiCanvas.height, 50); // 限制最大大小为50px
        // 根据素材大小百分比调整
        const emojiSize = baseEmojiSize * (this.currentImageSize / 100);
        const margin = 10; // 间距
        
        // 计算每行可容纳的表情数量
        const emojisPerRow = columns;
        const emojisPerCol = Math.ceil(height / (emojiSize + margin));
        
        // 计算起始位置，使整体居中
        const totalWidth = emojisPerRow * (emojiSize + margin) - margin;
        const totalHeight = emojisPerCol * (emojiSize + margin) - margin;
        const startX = (width - totalWidth) / 2;
        const startY = (height - totalHeight) / 2;
        
        // 绘制表情网格
        for (let row = 0; row < emojisPerCol; row++) {
            const rowY = startY + row * (emojiSize + margin);
            
            // 应用倾斜度到整行
            if (this.currentTilt !== 0) {
                ctx.save();
                // 计算行的中心点
                const rowCenterX = startX + totalWidth / 2;
                const rowCenterY = rowY + emojiSize / 2;
                ctx.translate(rowCenterX, rowCenterY);
                ctx.rotate(this.currentTilt * Math.PI / 180);
                ctx.translate(-rowCenterX, -rowCenterY);
            }
            
            // 绘制当前行的所有表情
            for (let col = 0; col < emojisPerRow; col++) {
                const x = startX + col * (emojiSize + margin);
                const y = rowY;
                
                // 绘制表情
                ctx.drawImage(emojiCanvas, x, y, emojiSize, emojiSize);
            }
            
            // 恢复画布状态
            if (this.currentTilt !== 0) {
                ctx.restore();
            }
        }
    }
    
    applyLayoutToAll() {
        this.images.forEach(imageInfo => {
            this.updateLayout(imageInfo);
        });
    }
    
    updateLayout(imageInfo) {
        const { img, canvas, ctx, previewImg } = imageInfo;
        const width = canvas.width;
        const height = canvas.height;
        
        // 1. 填充背景色
        ctx.fillStyle = this.currentBackground;
        ctx.fillRect(0, 0, width, height);
        
        // 2. 先创建一个临时Canvas来处理原始图片
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);
        
        // 3. 应用颜色覆盖到原始图片（使用用户选择的颜色）
        const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const tempData = tempImageData.data;
        const color = this.colorPicker.value;
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        for (let i = 0; i < tempData.length; i += 4) {
            const alpha = tempData[i + 3];
            if (alpha > 0) {
                tempData[i] = r;
                tempData[i + 1] = g;
                tempData[i + 2] = b;
            }
        }
        tempCtx.putImageData(tempImageData, 0, 0);
        
        // 4. 根据列数排列表情符号
        this.drawEmojisInGrid(ctx, tempCanvas, width, height, this.currentColumns);
        
        // 更新预览
        if (previewImg) {
            previewImg.src = canvas.toDataURL();
        }
    }
    
    updateImageSize(imageInfo) {
        const { img, canvas, ctx, previewImg } = imageInfo;
        const width = parseInt(this.widthInput.value) || 200;
        const height = parseInt(this.heightInput.value) || 200;
        
        // 更新Canvas大小
        canvas.width = width;
        canvas.height = height;
        
        // 重新应用布局
        this.updateLayout(imageInfo);
    }
    
    applyColorToAll() {
        const color = this.colorPicker.value;
        this.images.forEach(imageInfo => {
            this.applyColorToImage(imageInfo, color);
        });
    }
    
    applyColorToImage(imageInfo, color) {
        const { img, canvas, ctx, previewImg } = imageInfo;
        
        // 1. 填充背景色（浅蓝色）
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. 先创建一个临时Canvas来处理原始图片
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);
        
        // 3. 应用颜色覆盖到原始图片（设置为白色）
        const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const tempData = tempImageData.data;
        
        for (let i = 0; i < tempData.length; i += 4) {
            const alpha = tempData[i + 3];
            if (alpha > 0) {
                tempData[i] = 255;     // 红色通道（白色）
                tempData[i + 1] = 255; // 绿色通道（白色）
                tempData[i + 2] = 255; // 蓝色通道（白色）
                // 保持原始透明度
            }
        }
        tempCtx.putImageData(tempImageData, 0, 0);
        
        // 4. 根据列数排列表情符号
        this.drawEmojisInGrid(ctx, tempCanvas, canvas.width, canvas.height, this.currentColumns);
        
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
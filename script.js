class EmojiBackgroundGenerator {
    constructor() {
        this.uploadInput = document.getElementById('image-upload');
        this.colorPicker = document.getElementById('color-picker');
        this.hexColorInput = document.getElementById('hex-color-input');
        this.applyColorBtn = document.getElementById('apply-color');
        this.backgroundPicker = document.getElementById('background-picker');
        this.hexBackgroundInput = document.getElementById('hex-background-input');
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
        this.horizontalSpacingInput = document.getElementById('horizontal-spacing-input');
        this.horizontalSpacingValue = document.getElementById('horizontal-spacing-value');
        this.verticalSpacingInput = document.getElementById('vertical-spacing-input');
        this.verticalSpacingValue = document.getElementById('vertical-spacing-value');
        this.presetColorsContainer = document.getElementById('preset-colors-container');
        this.currentColumns = 2; // 默认2列
        this.currentTilt = 0; // 默认倾斜度
        this.currentImageSize = 50; // 默认素材大小（百分比）
        this.currentHorizontalSpacing = 10; // 默认水平间距
        this.currentVerticalSpacing = 10; // 默认垂直间距
        this.currentBackground = '#f0f8ff'; // 默认背景色
        this.images = [];
        
        // 预设颜色数据
        this.presetColors = [
            {
                name: 'Leo/need💫',
                colors: [
                    { name: 'ick', color: '#33AAEE' },
                    { name: 'saki', color: '#FFDD44' },
                    { name: 'hnm', color: '#EE6666' },
                    { name: 'shiho', color: '#BBDD22' }
                ]
            },
            {
                name: 'MORE MORE JUMP！☘️',
                colors: [
                    { name: 'mnr', color: '#FFCCAA' },
                    { name: 'hrk', color: '#99CCFF' },
                    { name: 'airi', color: '#FFAACC' },
                    { name: 'szk', color: '#99EEDD' }
                ]
            },
            {
                name: 'Vivid BAD SQUAD🎤',
                colors: [
                    { name: 'khn', color: '#FF6699' },
                    { name: 'an', color: '#00BBDD' },
                    { name: 'akt', color: '#FF7722' },
                    { name: 'toya', color: '#0077DD' }
                ]
            },
            {
                name: 'Wonderlands×Showtime🎪',
                colors: [
                    { name: 'tks', color: '#FFBB00' },
                    { name: 'emu', color: '#FF66BB' },
                    { name: 'nene', color: '#33DD99' },
                    { name: 'rui', color: '#BB88EE' }
                ]
            },
            {
                name: 'Nightcord at 25:00🎧',
                colors: [
                    { name: 'knd', color: '#BB6688' },
                    { name: 'mfy', color: '#8888CC' },
                    { name: 'ena', color: '#CCAA88' },
                    { name: 'mzk', color: '#DDAACC' }
                ]
            },
            {
                name: 'VIRTUAL SINGER✨️',
                colors: [
                    { name: 'miku', color: '#33CCBB' },
                    { name: 'rin', color: '#FFCC11' },
                    { name: 'len', color: '#FFEE11' },
                    { name: 'luka', color: '#FFBBCC' },
                    { name: 'meiko', color: '#DD4444' },
                    { name: 'kaito', color: '#3366CC' }
                ]
            }
        ];
        
        this.initEventListeners();
        this.loadSavedSettings();
        this.generatePresetColors();
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
        
        // 颜色选择器变化事件
        this.colorPicker.addEventListener('change', () => {
            this.hexColorInput.value = this.colorPicker.value;
        });
        
        // 十六进制颜色输入变化事件
        this.hexColorInput.addEventListener('change', () => {
            const hexColor = this.hexColorInput.value;
            // 验证十六进制颜色格式
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                this.colorPicker.value = hexColor;
            }
        });
        
        // 背景色选择器变化事件
        this.backgroundPicker.addEventListener('change', () => {
            this.hexBackgroundInput.value = this.backgroundPicker.value;
        });
        
        // 背景色十六进制输入变化事件
        this.hexBackgroundInput.addEventListener('change', () => {
            const hexColor = this.hexBackgroundInput.value;
            // 验证十六进制颜色格式
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                this.backgroundPicker.value = hexColor;
            }
        });
        
        // 素材大小调整事件
        this.imageSizeInput.addEventListener('input', () => {
            this.currentImageSize = parseInt(this.imageSizeInput.value);
            this.imageSizeValue.textContent = `${this.currentImageSize}%`;
            this.applyLayoutToAll();
            this.saveSettings();
        });
        
        // 水平间距调整事件
        this.horizontalSpacingInput.addEventListener('input', () => {
            this.currentHorizontalSpacing = parseInt(this.horizontalSpacingInput.value);
            this.horizontalSpacingValue.textContent = `${this.currentHorizontalSpacing}px`;
            this.applyLayoutToAll();
            this.saveSettings();
        });
        
        // 垂直间距调整事件
        this.verticalSpacingInput.addEventListener('input', () => {
            this.currentVerticalSpacing = parseInt(this.verticalSpacingInput.value);
            this.verticalSpacingValue.textContent = `${this.currentVerticalSpacing}px`;
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
                // 先保存原始图片质量
                tempCtx.imageSmoothingEnabled = true;
                tempCtx.imageSmoothingQuality = 'high';
                
                // 应用颜色覆盖
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
                
                // 再次设置高质量渲染
                tempCtx.imageSmoothingEnabled = true;
                tempCtx.imageSmoothingQuality = 'high';
                
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
        // 关键：使用素材图片的原始尺寸，不进行任何缩放
        const emojiWidth = emojiCanvas.width;
        const emojiHeight = emojiCanvas.height;
        
        // 使用用户设置的间距
        const horizontalSpacing = this.currentHorizontalSpacing;
        const verticalSpacing = this.currentVerticalSpacing;
        
        // 计算需要多少行和列才能填满整个画布
        // 首先计算基于用户选择的列数，确保覆盖整个宽度
        let emojisPerRow = columns;
        // 计算实际每行的宽度，确保覆盖整个画布
        const rowWidth = emojisPerRow * (emojiWidth + horizontalSpacing) - horizontalSpacing;
        // 如果当前列数不够覆盖宽度，增加列数
        if (rowWidth < width) {
            emojisPerRow = Math.ceil(width / (emojiWidth + horizontalSpacing)) + 1;
        }
        
        // 计算需要多少行才能覆盖整个高度，考虑倾斜度的影响
        // 当有倾斜度时，需要增加行数以确保覆盖整个画布
        const rowHeight = emojiHeight + verticalSpacing;
        const emojisPerCol = Math.ceil(height / rowHeight) + 3; // 增加额外的行以确保覆盖
        
        // 从左上角开始绘制，考虑倾斜度的影响
        const startX = -emojiWidth; // 向左偏移一个图片宽度，确保覆盖左侧
        const startY = -emojiHeight; // 向上偏移一个图片高度，确保覆盖顶部
        
        // 确保高质量渲染
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // 绘制表情网格
        for (let row = 0; row < emojisPerCol; row++) {
            const rowY = startY + row * rowHeight;
            
            // 计算交错排列的偏移量
            const staggerOffset = row % 2 === 1 ? (emojiWidth + horizontalSpacing) / 2 : 0;
            
            // 应用倾斜度到整行
            if (this.currentTilt !== 0) {
                ctx.save();
                const rowCenterX = width / 2;
                const rowCenterY = rowY + emojiHeight / 2;
                ctx.translate(rowCenterX, rowCenterY);
                ctx.rotate(this.currentTilt * Math.PI / 180);
                ctx.translate(-rowCenterX, -rowCenterY);
            }
            
            // 绘制当前行的所有表情
            for (let col = 0; col < emojisPerRow; col++) {
                const x = startX + col * (emojiWidth + horizontalSpacing) + staggerOffset;
                const y = rowY;
                
                // 直接绘制原始尺寸的图片，不进行任何缩放
                ctx.drawImage(emojiCanvas, x, y);
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
        // 设置高质量渲染
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        
        // 应用颜色覆盖
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
        
        // 再次设置高质量渲染
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        
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
        
        // 1. 填充背景色（使用用户设置的背景色）
        ctx.fillStyle = this.currentBackground;
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
    
    generatePresetColors() {
        this.presetColorsContainer.innerHTML = '';
        
        this.presetColors.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'preset-color-group';
            
            const groupTitle = document.createElement('h4');
            groupTitle.textContent = group.name;
            groupElement.appendChild(groupTitle);
            
            group.colors.forEach(item => {
                const colorItem = document.createElement('div');
                colorItem.className = 'preset-color-item';
                
                const colorSwatch = document.createElement('div');
                colorSwatch.className = 'preset-color-swatch';
                colorSwatch.style.backgroundColor = item.color;
                
                const colorName = document.createElement('span');
                colorName.className = 'preset-color-name';
                colorName.textContent = item.name;
                
                colorItem.appendChild(colorSwatch);
                colorItem.appendChild(colorName);
                
                // 添加点击事件
                colorItem.addEventListener('click', () => {
                    this.colorPicker.value = item.color;
                    this.hexColorInput.value = item.color;
                });
                
                groupElement.appendChild(colorItem);
            });
            
            this.presetColorsContainer.appendChild(groupElement);
        });
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    new EmojiBackgroundGenerator();
});
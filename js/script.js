// 地图背景图片
const mapImage = new Image();
mapImage.src = 'map.jpg'; // 替换为实际地图图片路径

// 基站数据
const baseStations = [
    {
        id: 1,
        name: "WD station",
        x: 320,
        y: 440,
        height: 80,
        tilt: 10,
        gain: 15,
        azimuth: [50, 180, 300]
    },
    {
        id: 2,
        name: "XCDL station",
        x: 625,
        y: 45,
        height: 40,
        tilt: 10,
        gain: 15,
        azimuth: [60, 180, 300]
    },
    {
        id: 3,
        name: "BEI station",
        x: 625,
        y: 135,
        height: 15,
        tilt: 10,
        gain: 15,
        azimuth: [60, 180, 300]
    },
    {
        id: 4,
        name: "NAN station",
        x: 630,
        y: 240,
        height: 40,
        tilt: 10,
        gain: 15,
        azimuth: [60, 180, 300]
    },
    {
        id: 5,
        name: "TY station",
        x: 830,
        y: 320,
        height: 70,
        tilt: 10,
        gain: 15,
        azimuth: [60, 200, 300]
    },
    {
        id: 6,
        name: "YDJ station",
        x: 920,
        y: 460,
        height: 30,
        tilt: 10,
        gain: 15,
        azimuth: [60, 180, 300]
    }
];

// 用户设备数据
let userDevices = [];

// 等待地图图片加载完成
mapImage.onload = function() {
    initMap();
    renderBaseStations();
    renderUserDevices();
};

// 初始化地图
function initMap() {
    const mapCanvas = document.getElementById('coverage-map');
    const ctx = mapCanvas.getContext('2d');
    
    // 设置画布大小与容器匹配
    mapCanvas.width = mapCanvas.offsetWidth;
    mapCanvas.height = mapCanvas.offsetHeight;
    
    // 绘制地图背景
    ctx.drawImage(mapImage, 0, 0, mapCanvas.width, mapCanvas.height);
    
}

// 渲染基站
function renderBaseStations() {
    const mapCanvas = document.getElementById('coverage-map');
    const ctx = mapCanvas.getContext('2d');
    
    // 清除现有基站标记
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.drawImage(mapImage, 0, 0, mapCanvas.width, mapCanvas.height);
    
    // 绘制基站标记和信息
    baseStations.forEach(bs => {
        const bsX = (bs.x / 1000) * mapCanvas.width;
        const bsY = (bs.y / 500) * mapCanvas.height;
        
        // 绘制基站图标
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(bsX, bsY);
        ctx.lineTo(bsX - 15, bsY + 20);
        ctx.lineTo(bsX + 15, bsY + 20);
        ctx.closePath();
        ctx.fill();
        
        // 绘制基站名称
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(bs.name, bsX, bsY - 5);
        
        // 绘制基站ID
        ctx.fillStyle = 'blue';
        ctx.font = '13px Arial';
        ctx.fillText(`ID: ${bs.id}`, bsX, bsY + 25);
    });
    
    // 绘制表格中的基站信息
    const tbody = document.querySelector('#base-stations-table tbody');
    tbody.innerHTML = '';
    
    baseStations.forEach(bs => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${bs.id}</td>
            <td>${bs.name}</td>
            <td>${bs.x}</td>
            <td>${bs.y}</td>
            <td>${bs.height}</td>
            <td>${bs.tilt}</td>
            <td>${bs.gain}</td>
            <td>${bs.azimuth.join(', ')}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// 渲染用户设备
function renderUserDevices() {
    const mapCanvas = document.getElementById('coverage-map');
    const ctx = mapCanvas.getContext('2d');
    
    
    // 绘制用户设备标记
    userDevices.forEach(device => {
        const x = (device.x / 1000) * mapCanvas.width;
        const y = (device.y / 500) * mapCanvas.height;
        
        // 绘制用户设备图标
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制用户设备ID
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(device.id, x, y - 20);
    });
    
    // 更新用户设备信息面板
    const userDevicesInfo = document.getElementById('user-devices-info');
    userDevicesInfo.innerHTML = '';
    
    if (userDevices.length > 0) {
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Height</th>
                        <th>RSRP(dBm)</th>
                        <th>SINR(dB)</th>
                        <th>Connected Station</th>
                        <th>Operate</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        
        userDevices.forEach(device => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${device.id}</td>
                <td>${device.x}</td>
                <td>${device.y}</td>
                <td>${device.height}</td>
                <td>${device.rsrp}</td>
                <td>${device.sinr}</td>
                <td>${device.connectedBs}</td>
                <td><button class="remove-device" data-id="${device.id}">Remove</button></td>
            `;
            
            table.querySelector('tbody').appendChild(row);
        });
        
        userDevicesInfo.appendChild(table);
        
        // 添加移除设备事件监听
        document.querySelectorAll('.remove-device').forEach(button => {
            button.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-id'); 
                userDevices = userDevices.filter(device => device.id !== deviceId);
                renderUserDevices();
                renderBaseStations(); 
            });
        });
    } 
}


// 添加用户设备
document.getElementById('add-user').addEventListener('click', function() {
    const userId = document.getElementById('user-id').value;
    const userX = parseFloat(document.getElementById('user-x').value);
    const userY = parseFloat(document.getElementById('user-y').value);
    const userHeight = parseFloat(document.getElementById('user-height').value);
    
    if (!userId || isNaN(userX) || isNaN(userY) || isNaN(userHeight)) {
        alert('请输入完整的用户设备信息');
        return;
    }
  
// 计算sinr，rsrp
    const {rsrp, sinr, connectedBs} = calculateSignal(userX, userY, userHeight);
   
//天线增益计算函数
    function calculateAntennaGain(d2D, bsHeight, ueHeight, phiMain, phiUser, tilt, bsGain) {
        // 计算垂直角度（度）
        const theta = Math.atan2(bsHeight - ueHeight, d2D) * 180 / Math.PI;
        
        // 水平方向增益（余弦模型）
        const horizontalDiff = Math.min(Math.abs(phiUser - phiMain), 360 - Math.abs(phiUser - phiMain));
        const horizontalGain = -Math.min(12 * Math.pow(horizontalDiff / 65, 2), 25);
    
        // 垂直方向增益（余弦模型）
        const verticalDiff = Math.abs(theta - tilt);
        const verticalGain = -Math.min(12 * Math.pow(verticalDiff / 65, 2), 25);
    
        // 总增益 = 基站增益 + 水平增益 + 垂直增益
        return bsGain + horizontalGain + verticalGain;
    }
    
 // 添加信号计算函数
 function calculateSignal(x, y, height) {
    let bestRsrp = -Infinity;
    let bestBsId = null;
    let totalInterference = 0;
    let servingCellPower = 0;
    const noiseFloor = -95; 
 
    baseStations.forEach(bs => {
        // 计算2D和3D距离
        const d2D = Math.sqrt((x - bs.x)**2 + (y - bs.y)**2);
        const d3D = Math.sqrt(d2D**2 + (bs.height - height)**2);
        
        // 计算用户方位角（0-360度）
        const phiUser = (Math.atan2(y - bs.y, x - bs.x) * 180 / Math.PI + 360) % 360;
        
        // 选择最近的基站方位角
        const phiMain = bs.azimuth.reduce((prev, curr) => {
            const diffPrev = Math.min(Math.abs(prev - phiUser), 360 - Math.abs(prev - phiUser));
            const diffCurr = Math.min(Math.abs(curr - phiUser), 360 - Math.abs(curr - phiUser));
            return diffCurr < diffPrev ? curr : prev;
        });
        
        // 计算天线增益
        const antennaGain = calculateAntennaGain(d2D, bs.height, height, phiMain, phiUser, bs.tilt, bs.gain);
        
        // 使用新的路径损耗公式
        const pathLoss = 22 * Math.log10(d3D) + 28.0 + 20 * Math.log10(3.5);
        
        // 计算RSRP
        const rsrp = 30 + antennaGain - pathLoss; // EPRE=30dBm

        // 更新最佳信号和干扰
        if(rsrp > bestRsrp) {
            // 将之前的服务小区加入干扰
            if(bestBsId !== null) {
                totalInterference += Math.pow(10, servingCellPower/10);
            }
            servingCellPower = rsrp;
            bestRsrp = rsrp;
            bestBsId = bs.id;
        } else {
            // 将非服务小区加入干扰
            totalInterference += Math.pow(10, rsrp/10);
        }
    });
    
    // 计算SINR（考虑实际干扰和噪声）
    const sinr = 10 * Math.log10(
        Math.pow(10, servingCellPower/10) / 
        (Math.pow(10, noiseFloor/10) + totalInterference)
    );
    
    return {
        rsrp: Math.round(bestRsrp * 10) / 10, // 保留1位小数
        sinr: Math.round(sinr * 10) / 10,
        connectedBs: bestBsId
    };
}

 userDevices.push({
    id: userId,
    x: userX,
    y: userY,
    height: userHeight,
    rsrp: rsrp,
    sinr: sinr,
    connectedBs: connectedBs
});
    
// 将用户设备数据存储到本地存储
localStorage.setItem('userDevices', JSON.stringify(userDevices));

    // 清空输入框
    document.getElementById('user-id').value = '';
    document.getElementById('user-x').value = '';
    document.getElementById('user-y').value = '';
    document.getElementById('user-height').value = '1.5';
    
    // 更新用户设备显示
    renderUserDevices();
});

// 新增随机生成设备功能
document.getElementById('generate-random').addEventListener('click', function() {
    const countInput = document.getElementById('device-count');
    const count = Math.min(100, Math.max(1, parseInt(countInput.value) || 10))
    
// 网格化均匀分布生成算法
function generateGridDevices(count) {
    const gridSize = Math.ceil(Math.sqrt(count));
    const cellWidth = 1000 / gridSize;
    const cellHeight = 500 / gridSize;
    
    let startId = 0;
        if (userDevices.length > 0) {
            startId = Math.max(...userDevices.map(device => parseInt(device.id, 10))) + 1;
        }

    for(let i = 0; i < count; i++) {
        const col = i % gridSize;
        const row = Math.floor(i / gridSize);
        
        // 在网格内生成随机坐标
        const x = Math.min(990, col * cellWidth + Math.random() * cellWidth);
        const y = Math.min(490, row * cellHeight + Math.random() * cellHeight);
        
        // 生成高度（保留一位小数）
        const height = Math.round((Math.random() * 0.6 + 1.2) * 10) / 10;
        
         // 计算信号参数
         const {rsrp, sinr, connectedBs} = calculateSignal(x, y, height);

         // 新增天线增益计算函数
        function calculateAntennaGain(d2D, bsHeight, ueHeight, phiMain, phiUser, tilt, bsGain) {
        // 计算垂直角度（度）
        const theta = Math.atan2(bsHeight - ueHeight, d2D) * 180 / Math.PI;
        
        // 水平方向增益（余弦模型）
        const horizontalDiff = Math.min(Math.abs(phiUser - phiMain), 360 - Math.abs(phiUser - phiMain));
        const horizontalGain = -Math.min(12 * Math.pow(horizontalDiff / 65, 2), 25);

        // 垂直方向增益（余弦模型）
        const verticalDiff = Math.abs(theta - tilt);
        const verticalGain = -Math.min(12 * Math.pow(verticalDiff / 65, 2), 25);

        // 总增益 = 基站增益 + 水平增益 + 垂直增益
        return bsGain + horizontalGain + verticalGain;
    }

// 更新信号计算函数
function calculateSignal(x, y, height) {
    let bestRsrp = -Infinity;
    let bestBsId = null;
    let totalInterference = 0;
    let servingCellPower = 0;
    const noiseFloor = -95; // 噪声基底（dBm）

    baseStations.forEach(bs => {
        // 计算2D和3D距离
        const d2D = Math.sqrt((x - bs.x)**2 + (y - bs.y)**2);
        const d3D = Math.sqrt(d2D**2 + (bs.height - height)**2);
        
        // 计算用户方位角（0-360度）
        const phiUser = (Math.atan2(y - bs.y, x - bs.x) * 180 / Math.PI + 360) % 360;
        
        // 选择最近的基站方位角
        const phiMain = bs.azimuth.reduce((prev, curr) => {
            const diffPrev = Math.min(Math.abs(prev - phiUser), 360 - Math.abs(prev - phiUser));
            const diffCurr = Math.min(Math.abs(curr - phiUser), 360 - Math.abs(curr - phiUser));
            return diffCurr < diffPrev ? curr : prev;
        });
        
        // 计算天线增益
        const antennaGain = calculateAntennaGain(d2D, bs.height, height, phiMain, phiUser, bs.tilt, bs.gain);
        
        // 使用新的路径损耗公式
        const pathLoss = 22 * Math.log10(d3D) + 28.0 + 20 * Math.log10(3.5);
        
        // 计算RSRP
        const rsrp = 30 + antennaGain - pathLoss; // EPRE=30dBm

        // 更新最佳信号和干扰
        if(rsrp > bestRsrp) {
            // 将之前的服务小区加入干扰
            if(bestBsId !== null) {
                totalInterference += Math.pow(10, servingCellPower/10);
            }
            servingCellPower = rsrp;
            bestRsrp = rsrp;
            bestBsId = bs.id;
        } else {
            // 将非服务小区加入干扰
            totalInterference += Math.pow(10, rsrp/10);
        }
    });

    // 计算SINR（考虑实际干扰和噪声）
    const sinr = 10 * Math.log10(
        Math.pow(10, servingCellPower/10) / 
        (Math.pow(10, noiseFloor/10) + totalInterference)
    );
    
    return {
        rsrp: Math.round(bestRsrp * 10) / 10, // 保留1位小数
        sinr: Math.round(sinr * 10) / 10,
        connectedBs: bestBsId
    };
}
         
         userDevices.push({
             id: (startId + i).toString(),
             x: Math.round(x),
             y: Math.round(y),
             height: height,
             rsrp: rsrp,
             sinr: sinr,
             connectedBs: connectedBs
         });
    }
}
    generateGridDevices(count);

    // 保存并刷新界面
    localStorage.setItem('userDevices', JSON.stringify(userDevices));
    
    renderUserDevices();
    renderBaseStations();
});

// 分析RSRP数据
document.getElementById('analyze-rsrp').addEventListener('click', function() {
    // 提取RSRP数据
    const rsrpValues = userDevices.map(device => device.rsrp);
    
    if (rsrpValues.length === 0) {
        alert('没有用户设备数据，无法进行分析');
        return;
    }
    
    // 计算统计量
    const mean = rsrpValues.reduce((sum, val) => sum + val, 0) / rsrpValues.length;
    const variance = rsrpValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / rsrpValues.length;
    const stdDev = Math.sqrt(variance);
    
    // 更新统计信息显示
    document.getElementById('sample-count').textContent = rsrpValues.length;
    document.getElementById('mean-value').textContent = `${mean.toFixed(2)} dBm`;
    document.getElementById('variance-value').textContent = variance.toFixed(2);
    document.getElementById('std-dev-value').textContent = stdDev.toFixed(2);
    
    
    // 计算覆盖概率
    const rsrpThreshold = -100; // RSRP门限值
    const rsrpCoverage = rsrpValues.filter(val => val >= rsrpThreshold).length;
    const rsrpCoverageProbability = (rsrpCoverage / rsrpValues.length) * 100;
    document.getElementById('coverage-probability').textContent = `${rsrpCoverageProbability.toFixed(2)}%`;

    // 动态计算数据范围（增加5%边距）
    const minVal = Math.min(...rsrpValues);
    const maxVal = Math.max(...rsrpValues);
    const dataRange = maxVal - minVal || 1; // 防止除零错误
    const axisMin = minVal - dataRange * 0.05;
    const axisMax = maxVal + dataRange * 0.05;

    // 绘制CDF
    drawDynamicCDF(rsrpValues, axisMin, axisMax);
    
    // 绘制PDF
    drawDynamicPDF(rsrpValues, axisMin, axisMax);

    // SINR分析
    const sinrValues = userDevices.map(device => device.sinr);
    
    if (sinrValues.length === 0) {
        alert('没有用户设备数据，无法进行分析');
        return;
    }
    
    // SINR统计计算
    const sinrMean = sinrValues.reduce((sum, val) => sum + val, 0) / sinrValues.length;
    const sinrVariance = sinrValues.reduce((sum, val) => sum + Math.pow(val - sinrMean, 2), 0) / sinrValues.length;
    const sinrStdDev = Math.sqrt(sinrVariance);
    
    // 更新SINR统计信息
    document.getElementById('sinr-sample-count').textContent = sinrValues.length;
    document.getElementById('sinr-mean-value').textContent = `${sinrMean.toFixed(2)} dB`;
    document.getElementById('sinr-variance-value').textContent = sinrVariance.toFixed(2);
    document.getElementById('sinr-std-dev-value').textContent = sinrStdDev.toFixed(2);
    
    // 计算SINR覆盖概率
    const sinrThreshold = -5.0; // SINR门限值
    const sinrCoverage = sinrValues.filter(val => val >= sinrThreshold).length;
    const sinrCoverageProbability = (sinrCoverage / sinrValues.length) * 100;
    document.getElementById('sinr-coverage-probability').textContent = `${sinrCoverageProbability.toFixed(2)}%`;

    // SINR动态范围计算
    const sinrMinVal = Math.min(...sinrValues);
    const sinrMaxVal = Math.max(...sinrValues);
    const sinrDataRange = sinrMaxVal - sinrMinVal || 1;
    const sinrAxisMin = sinrMinVal - sinrDataRange * 0.05;
    const sinrAxisMax = sinrMaxVal + sinrDataRange * 0.05;

    // SINR图表绘制
    drawDynamicSINRCDF(sinrValues, sinrAxisMin, sinrAxisMax);
    drawDynamicSINRPDF(sinrValues, sinrAxisMin, sinrAxisMax);
});

// 智能生成刻度函数
function generateTicks(min, max) {
    const range = max - min;
    let tickInterval;
    
    // 根据范围选择最佳间隔
    if (range <= 15) {
        tickInterval = 1;
    } else if (range <= 30) {
        tickInterval = 2;
    } else if (range <= 60) {
        tickInterval = 5;
    } else {
        tickInterval = Math.ceil(range / 10);
    }
    
    // 生成刻度数组
    const ticks = [];
    let current = Math.floor(min / tickInterval) * tickInterval;
    while (current <= max) {
        if (current >= min) ticks.push(current);
        current += tickInterval;
    }
    return ticks;
}

// 动态绘制CDF
function drawDynamicCDF(values, axisMin, axisMax) {
    const canvas = document.getElementById('rsrp-cdf');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 数据排序和预处理
    const sortedValues = [...values].sort((a, b) => a - b);
    const ticks = generateTicks(axisMin, axisMax);
    
    // 计算坐标映射
    const xScale = (canvas.width - 60) / (axisMax - axisMin);
    const yScale = (canvas.height - 60);

    // 绘制坐标轴
    drawEnhancedAxes(ctx, canvas, axisMin, axisMax, ticks, 'RSRP (dBm)', '累积概率');
    
    // 绘制CDF曲线
    ctx.beginPath();
    ctx.moveTo(
        30 + (sortedValues[0] - axisMin) * xScale,
        canvas.height - 30 - (1 / (sortedValues.length - 1)) * yScale
    );
    
    sortedValues.forEach((val, i) => {
        ctx.lineTo(
            30 + (val - axisMin) * xScale,
            canvas.height - 30 - (i / (sortedValues.length - 1)) * yScale
        );
    });
    
    ctx.strokeStyle = '#4285F4';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// 动态绘制PDF
function drawDynamicPDF(values, axisMin, axisMax) {
    const canvas = document.getElementById('rsrp-pdf');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 计算分箱参数
    const binCount = 20;
    const binWidth = (axisMax - axisMin) / binCount;
    const bins = new Array(binCount).fill(0);
    
    // 填充分箱数据
    let maxDensity = 0;
    values.forEach(val => {
        const binIndex = Math.min(
            Math.floor((val - axisMin) / binWidth),
            binCount - 1
        );
        bins[binIndex]++;
    });
    
    const maxCount = Math.max(...bins);
    maxDensity = maxCount / values.length; // 最大概率密度值
    
    // 动态计算Y轴范围（增加20%边距）
    const yAxisMax = maxDensity * 1.2;
    const ticks = generateYTicks(0, yAxisMax); // 生成Y轴刻度
    
    
    // 绘制坐标轴
    drawEnhancedAxes(ctx, canvas, axisMin, axisMax, 
        generateTicks(axisMin, axisMax),
        ticks,
        'RSRP (dBm)', 
        '概率密度',
        yAxisMax);

    // 定义彩虹色系
    const colorScale = [
    '#2E86C1', '#3498DB', '#5DADE2', // 蓝色系
    '#1ABC9C', '#16A085',           // 青绿色系
    '#F1C40F', '#F39C12',           // 黄色/橙色系
    '#E74C3C', '#C0392B'            // 红色系
    ];
    
    // 绘制柱状图
    bins.forEach((count, i) => {
        const x = 30 + i * ((canvas.width - 60) / binCount);
        const width = (canvas.width - 60) / binCount - 2;
        const height = (count / values.length) * (canvas.height - 60) / yAxisMax;
        
        // 动态选择颜色（根据数值比例）
        const colorIndex = Math.floor(
            (count / maxCount) * (colorScale.length - 1)
        );
        ctx.fillStyle = colorScale[colorIndex];
        
        ctx.fillRect(x, canvas.height - 30 - height, width, height);
    });
}

// SINR CDF绘制函数
function drawDynamicSINRCDF(values, axisMin, axisMax) {
    const canvas = document.getElementById('sinr-cdf');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const ticks = generateTicks(axisMin, axisMax);
    
    const xScale = (canvas.width - 60) / (axisMax - axisMin);
    const yScale = (canvas.height - 60);

    drawEnhancedAxes(ctx, canvas, axisMin, axisMax, ticks, 'SINR (dB)', '累积概率');
    
    ctx.beginPath();
    ctx.strokeStyle = '#F39C12'; // 使用橙色区分
    ctx.moveTo(
        30 + (sortedValues[0] - axisMin) * xScale,
        canvas.height - 30 - (1 / (sortedValues.length - 1)) * yScale
    );
    
    sortedValues.forEach((val, i) => {
        ctx.lineTo(
            30 + (val - axisMin) * xScale,
            canvas.height - 30 - (i / (sortedValues.length - 1)) * yScale
        );
    });
    
    ctx.lineWidth = 2;
    ctx.stroke();
}

// SINR PDF绘制函数
function drawDynamicSINRPDF(values, axisMin, axisMax) {
    const canvas = document.getElementById('sinr-pdf');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const binCount = 20;
    const binWidth = (axisMax - axisMin) / binCount;
    const bins = new Array(binCount).fill(0);
    
    let maxDensity = 0;
    values.forEach(val => {
        const binIndex = Math.min(
            Math.floor((val - axisMin) / binWidth),
            binCount - 1
        );
        bins[binIndex]++;
    });
    
    const maxCount = Math.max(...bins);
    maxDensity = maxCount / values.length;
    const yAxisMax = maxDensity * 1.2;
    const ticks = generateYTicks(0, yAxisMax);

    drawEnhancedAxes(ctx, canvas, axisMin, axisMax, 
        generateTicks(axisMin, axisMax),
        ticks,
        'SINR (dB)', 
        '概率密度',
        yAxisMax);

        const colorScale = [
            '#2E86C1', '#3498DB', '#5DADE2', // 蓝色系
            '#1ABC9C', '#16A085',           // 青绿色系
            '#F1C40F', '#F39C12',           // 黄色/橙色系
            '#E74C3C', '#C0392B'            // 红色系
            ];
    
    bins.forEach((count, i) => {
        const x = 30 + i * ((canvas.width - 60) / binCount);
        const width = (canvas.width - 60) / binCount - 2;
        const height = (count / values.length) * (canvas.height - 60) / yAxisMax;
        
        const colorIndex = Math.floor((count / maxCount) * (colorScale.length - 1));
        ctx.fillStyle = colorScale[colorIndex];
        
        ctx.fillRect(x, canvas.height - 30 - height, width, height);
    });
}

// 生成Y轴刻度（动态范围）
function generateYTicks(min, max) {
    const range = max - min;
    let interval;
    
    if (range <= 0.1) {
        interval = 0.02;
    } else if (range <= 0.2) {
        interval = 0.05;
    } else if (range <= 0.5) {
        interval = 0.1;
    } else {
        interval = 0.2;
    }
    
    const ticks = [];
    let current = Math.floor(min / interval) * interval;
    while (current <= max) {
        if (current >= min) ticks.push(current);
        current += interval;
    }
    return ticks;
}

// 增强的坐标轴绘制函数
function drawEnhancedAxes(ctx, canvas, axisMin, axisMax, ticks, xLabel, yLabel) {
    const padding = 30;
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#333';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.textBaseline = 'middle';
    
    // 绘制X轴
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // 绘制Y轴
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    
    // 绘制X轴刻度
    ctx.textAlign = 'center';
    ticks.forEach(val => {
        const x = padding + ((val - axisMin) / (axisMax - axisMin)) * (canvas.width - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - padding);
        ctx.lineTo(x, canvas.height - padding + 5);
        ctx.stroke();
        ctx.fillText(val.toFixed(1), x, canvas.height - padding + 8);
    });
    
    // 绘制Y轴刻度
    ctx.textAlign = 'right';
    [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(ratio => {
        const y = canvas.height - padding - ratio * (canvas.height - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding - 5, y);
        ctx.stroke();
        ctx.fillText(ratio.toFixed(1), padding - 8, y);
    });
    
    // 绘制轴标签
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, canvas.width/2, canvas.height - 5);
    
    ctx.save();
    ctx.translate(15, canvas.height/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
}

//#region TaskManager
// 修复基站管理功能
document.getElementById('add-bs').addEventListener('click', function() {
    const modal = document.getElementById('bs-modal');
    const formContainer = document.getElementById('bs-edit-form');
    
    formContainer.innerHTML = baseStations.map(bs => `
        <div class="bs-form-item">
            <h4>station ${bs.id}</h4>
            <div class="form-row">
                <label>name: <input type="text" value="${bs.name}" data-field="name"></label>
                <label>X: <input type="number" value="${bs.x}" data-field="x"></label>
                <label>Y: <input type="number" value="${bs.y}" data-field="y"></label>
            </div>
            <div class="form-row">
                <label>Height: <input type="number" value="${bs.height}" data-field="height"></label>
                <label>Dip angle: <input type="number" value="${bs.tilt}" data-field="tilt"></label>
                <label>gain: <input type="number" value="${bs.gain}" data-field="gain"></label>
            </div>
            <div class="form-row">
                <label>azimuth: 
                    <input type="text" value="${bs.azimuth.join(', ')}" data-field="azimuth">
                    <small>（Comma separated）</small>
                </label>
            </div>
        </div>
    `).join('');

    modal.style.display = 'block';
});

// 修复保存功能
document.getElementById('save-bs-changes').addEventListener('click', function() {
    document.querySelectorAll('.bs-form-item').forEach(div => {
        const inputs = div.querySelectorAll('input');
        const bsId = parseInt(div.querySelector('h4').textContent.match(/\d+/)[0]);
        const bs = baseStations.find(b => b.id === bsId);

        inputs.forEach(input => {
            const field = input.dataset.field;
            const value = input.type === 'number' ? 
                parseFloat(input.value) : 
                input.value;

            if (field === 'azimuth') {
                bs[field] = input.value.split(',').map(Number);
            } else {
                bs[field] = value;
            }
        });
    });

    renderBaseStations();
    
     // 关闭模态框
     const modal = document.getElementById('bs-modal');
     modal.style.display = 'none';
    });
     // 关闭模态框
document.querySelector('.close').addEventListener('click', function() {
    const modal = document.getElementById('bs-modal');
    modal.style.display = 'none';
});

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bs-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

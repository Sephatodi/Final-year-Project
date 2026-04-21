import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

// Note: This is a simplified chart component. In production, integrate with Recharts or Chart.js
const Chart = ({ 
  type = 'line',
  data = [],
  width = '100%',
  height = 300,
  colors = ['#13ec5b', '#f59e0b', '#ef4444', '#3b82f6'],
  showLegend = true,
  showGrid = true,
  className = '' 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw based on chart type
    switch(type) {
      case 'line':
        drawLineChart(ctx, width, height, data, colors);
        break;
      case 'bar':
        drawBarChart(ctx, width, height, data, colors);
        break;
      case 'pie':
        drawPieChart(ctx, width, height, data, colors);
        break;
    }
  }, [type, data, colors]);

  const drawLineChart = (ctx, width, height, data, colors) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find max value
    const maxValue = Math.max(...data.flatMap(d => d.values || [d.value]));

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
      }
      ctx.stroke();
    }

    // Draw lines
    if (data[0]?.values) {
      // Multi-line chart
      data.forEach((dataset, datasetIndex) => {
        const color = colors[datasetIndex % colors.length];
        const values = dataset.values;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        values.forEach((value, index) => {
          const x = padding + (chartWidth / (values.length - 1)) * index;
          const y = padding + chartHeight - (value / maxValue) * chartHeight;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        // Draw points
        values.forEach((value, index) => {
          const x = padding + (chartWidth / (values.length - 1)) * index;
          const y = padding + chartHeight - (value / maxValue) * chartHeight;

          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });
    } else {
      // Single line
      const values = data.map(d => d.value);
      
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 2;
      ctx.beginPath();

      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
  };

  const drawBarChart = (ctx, width, height, data, colors) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = (chartWidth / data.length) * 0.7;

    const maxValue = Math.max(...data.map(d => d.value));

    data.forEach((item, index) => {
      const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = padding + chartHeight - barHeight;

      // Draw bar
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value label
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.value, x + barWidth / 2, y - 5);

      // Draw label
      ctx.fillText(item.label, x + barWidth / 2, height - 10);
    });
  };

  const drawPieChart = (ctx, width, height, data, colors) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * radius * 1.2;
      const labelY = centerY + Math.sin(labelAngle) * radius * 1.2;

      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, labelX, labelY);

      startAngle = endAngle;
    });

    // Draw center circle for donut effect
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className={className} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
      
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm">{item.label || item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Chart.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'pie']),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      values: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colors: PropTypes.arrayOf(PropTypes.string),
  showLegend: PropTypes.bool,
  showGrid: PropTypes.bool,
  className: PropTypes.string,
};

export default Chart;
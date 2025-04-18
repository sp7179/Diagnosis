"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  Bar,
  Line,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import "../styles/chartDisplay.css";

const ChartDisplay = ({
  showChart,
  activeChart,
  chartData,
  handleChartTypeChange,
  handlePieSectorEnter,
  activeIndex,
  renderActiveShape,
  sampleQuestions,
  handleSampleQuestion,
}) => {
  const COLORS = [
    "#1E90FF", // Dodger Blue
    "#00BFFF", // Deep Sky Blue
    "#87CEFA", // Light Sky Blue
    "#4169E1", // Royal Blue
    "#6495ED", // Cornflower Blue
    "#4682B4", // Steel Blue
  ];

  const GRADIENTS = [
    ["#1E90FF", "#00BFFF"],
    ["#4169E1", "#6495ED"],
    ["#0A192F", "#1E90FF"],
    ["#112240", "#4682B4"],
    ["#4682B4", "#87CEFA"],
    ["#6495ED", "#87CEFA"],
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-title">{label || payload[0].name}</div>
          <div className="tooltip-item">
            <span className="tooltip-label">Value:</span> {payload[0].value}
          </div>
          {payload[0].payload.target && (
            <div className="tooltip-item">
              <span className="tooltip-label">Target:</span>{" "}
              {payload[0].payload.target}
            </div>
          )}
          {payload[0].payload.previous && (
            <div className="tooltip-item">
              <span className="tooltip-label">Previous:</span>{" "}
              {payload[0].payload.previous}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case "bar":
        return (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData.data} className="chart">
                <defs>
                  {GRADIENTS.map((gradient, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`barColor${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={gradient[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={gradient[1]}
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                  stroke="#8892B0"
                />
                <XAxis dataKey="name" tick={{ fill: "#CCD6F6" }} />
                <YAxis tick={{ fill: "#CCD6F6" }} />
                <Tooltip content={<CustomTooltip />} />
                {/* Remove default Legend, use custom below */}
                <Bar
                  dataKey="value"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  isAnimationActive={true}
                >
                  {chartData.data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#barColor${index % GRADIENTS.length})`}
                      className="chart-cell"
                      cursor="pointer"
                    />
                  ))}
                </Bar>
                {chartData.data[0]?.target && (
                  <Bar
                    dataKey="target"
                    fill="url(#barColor1)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    isAnimationActive={true}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
            <div className="bar-legend">
              {chartData.data.map((entry, idx) => (
                <div key={entry.name} className="bar-legend-item">
                  <span
                    className="bar-legend-dot"
                    style={{
                      background: `url(#barColor${idx % GRADIENTS.length})`,
                      backgroundColor: GRADIENTS[idx % GRADIENTS.length][0],
                    }}
                  />
                  <span className="bar-legend-label">{entry.name}</span>
                  <span className="bar-legend-value">{entry.value}</span>
                  {entry.target && (
                    <span className="bar-legend-target">
                      Target: {entry.target}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      case "line":
        return (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsLineChart data={chartData.data} className="chart">
                <defs>
                  {GRADIENTS.map((gradient, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`lineColor${index}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor={gradient[0]} />
                      <stop offset="100%" stopColor={gradient[1]} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                  stroke="#8892B0"
                />
                <XAxis dataKey="name" tick={{ fill: "#CCD6F6" }} />
                <YAxis tick={{ fill: "#CCD6F6" }} />
                <Tooltip content={<CustomTooltip />} />
                {/* Remove default Legend, use custom below */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={`url(#lineColor0)`}
                  strokeWidth={3}
                  dot={{
                    fill: COLORS[0],
                    strokeWidth: 2,
                    r: 6,
                    strokeDasharray: "",
                  }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: COLORS[0] }}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                />
                {chartData.data[0]?.target && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke={`url(#lineColor1)`}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{
                      fill: COLORS[1],
                      strokeWidth: 2,
                      r: 6,
                      strokeDasharray: "",
                    }}
                    animationDuration={2000}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                  />
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
            <div className="line-legend">
              {chartData.data.map((entry, idx) => (
                <div key={entry.name} className="line-legend-item">
                  <span
                    className="line-legend-dot"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <span className="line-legend-label">{entry.name}</span>
                  <span className="line-legend-value">{entry.value}</span>
                  {entry.target && (
                    <span className="line-legend-target">
                      Target: {entry.target}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      case "pie":
        return (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsPieChart className="chart">
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#1E90FF"
                  dataKey="value"
                  onMouseEnter={handlePieSectorEnter}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  isAnimationActive={true}
                  paddingAngle={2}
                  stroke="#0a192f"
                  strokeWidth={2}
                >
                  {chartData.data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="chart-cell"
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {chartData.data.map((entry, idx) => (
                <div key={entry.name} className="pie-legend-item">
                  <span
                    className="pie-legend-dot"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <span className="pie-legend-label">{entry.name}</span>
                  <span className="pie-legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </>
        );
      case "area":
        return (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsAreaChart data={chartData.data} className="chart">
                <defs>
                  {GRADIENTS.map((gradient, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`areaColor${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={gradient[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={gradient[1]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.3}
                  stroke="#8892B0"
                />
                <XAxis dataKey="name" tick={{ fill: "#CCD6F6" }} />
                <YAxis tick={{ fill: "#CCD6F6" }} />
                <Tooltip content={<CustomTooltip />} />
                {/* Remove default Legend, use custom below */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS[0]}
                  fill={`url(#areaColor0)`}
                  strokeWidth={3}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                />
                {chartData.data[0]?.target && (
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke={COLORS[1]}
                    fill={`url(#areaColor1)`}
                    strokeWidth={3}
                    animationDuration={2000}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                  />
                )}
              </RechartsAreaChart>
            </ResponsiveContainer>
            <div className="area-legend">
              {chartData.data.map((entry, idx) => (
                <div key={entry.name} className="area-legend-item">
                  <span
                    className="area-legend-dot"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <span className="area-legend-label">{entry.name}</span>
                  <span className="area-legend-value">{entry.value}</span>
                  {entry.target && (
                    <span className="area-legend-target">
                      Target: {entry.target}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      case "radial":
        return (
          <>
            <ResponsiveContainer width="100%" height={340}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="90%"
                barSize={28}
                data={chartData.data}
                startAngle={90}
                endAngle={-270}
                className="chart"
              >
                <RadialBar
                  minAngle={15}
                  label={{
                    fill: "#CCD6F6",
                    position: "insideStart",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                  background
                  clockWise
                  dataKey="value"
                  animationDuration={1800}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                >
                  {chartData.data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      cursor="pointer"
                    />
                  ))}
                </RadialBar>
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="radial-legend">
              {chartData.data.map((entry, idx) => (
                <div key={entry.name} className="radial-legend-item">
                  <span
                    className="radial-legend-dot"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <span className="radial-legend-label">{entry.name}</span>
                  <span className="radial-legend-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chart-panel">
      <div className="chart-header">
        {!showChart && (
          <h2 className="chart-title">
            <span className="chart-icon">
              <img
                src="/data.png"
                alt="Chart Visual"
                className="chart-title-img"
                width={32}
                height={32}
                style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
            </span>
            Data Visualization
          </h2>
        )}
        {showChart && (
          <div className="chart-tabs">
            <button
              className={`chart-tab ${activeChart === "bar" ? "active" : ""}`}
              onClick={() => handleChartTypeChange("bar")}
            >
              Bar
            </button>
            <button
              className={`chart-tab ${activeChart === "line" ? "active" : ""}`}
              onClick={() => handleChartTypeChange("line")}
            >
              Line
            </button>
            <button
              className={`chart-tab ${activeChart === "pie" ? "active" : ""}`}
              onClick={() => handleChartTypeChange("pie")}
            >
              Pie
            </button>
            <button
              className={`chart-tab ${activeChart === "area" ? "active" : ""}`}
              onClick={() => handleChartTypeChange("area")}
            >
              Area
            </button>
            <button
              className={`chart-tab ${
                activeChart === "radial" ? "active" : ""
              }`}
              onClick={() => handleChartTypeChange("radial")}
            >
              Radial
            </button>
          </div>
        )}
      </div>

      <div className="chart-content">
        {showChart ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="chart-container"
            >
              <h3 className="chart-data-title">{chartData.title}</h3>
              {renderChart()}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="empty-chart">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="empty-chart-content"
            >
              <div className="chart-icon-container">
                <motion.div
                  className="chart-icon-background"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <div className="chart-icon-wrapper">
                  <img
                    src="/chart.png"
                    alt="Chart Visual"
                    className="large-chart-icon-img"
                    width={56}
                    height={56}
                    style={{ display: "block", margin: "0 auto" }}
                  />
                </div>
              </div>
              <div className="empty-chart-text">
                <h3 className="empty-chart-title">No Visualization Yet</h3>
                <p className="empty-chart-description">
                  Ask me to generate or visualize data for you
                </p>
                <div className="empty-chart-buttons">
                  {sampleQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      className="empty-chart-button"
                      onClick={() => handleSampleQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;

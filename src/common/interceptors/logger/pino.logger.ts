// 导入依赖：Pino 日志库、路径处理、文件系统操作
import pino from 'pino';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
// 定义日志目录和日志文件路径
const logDir = join(process.cwd(), 'logs');
const logFilePath = join(process.cwd(), 'logs', 'access.log');

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}
// 创建并导出 Pino 日志实例
export const pinoLogger = pino(
  {
    level: 'info', // 日志输出级别：只记录 info 及更高级别（warn、error 等）
    timestamp: () => `,"time":"${new Date().toISOString()}"`, // 自定义时间戳格式（ISO 标准格式）
    formatters: {
      level: (label) => ({ level: label }), // 格式化日志级别（如将 "info" 转为 { level: "info" }）
    },
  },
  pino.destination(logFilePath), // 指定日志输出目标（这里是本地文件 access.log）
);

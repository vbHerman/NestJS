import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
// 修正导入路径
import { pinoLogger } from './logger/pino.logger';
//const logger: pino.logger = pinoLogger;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = pinoLogger; // 此时 logger 应为 Pino 实例，包含 log 方法
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url, params, query } = request;
    const now = Date.now();

    if (url && typeof url === 'string' && url.startsWith('/users')) {
      this.logger.info(
        // 现在应正确识别 log 方法
        `[开始] ${method} ${url} | 参数: ${JSON.stringify(params)} | 查询: ${JSON.stringify(query)}`,
      );
    }
    return next.handle().pipe(
      tap((response) => {
        // 注意这里之前的路由判断是 /user，建议统一为 /users 避免漏判
        if (url && typeof url === 'string' && url.startsWith('/users')) {
          this.logger.info(
            `[结束] ${method} ${url} | 耗时: ${Date.now() - now}ms | 响应: ${JSON.stringify(response)}`,
          );
        }
      }),
    );
  }
}

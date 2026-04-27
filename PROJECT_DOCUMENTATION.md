# NestJS + Prisma 项目完整指南

## 📋 项目概览

这是一个基于 **NestJS** 框架和 **Prisma ORM** 的企业级 Node.js 应用，配合 **SQL Server** 数据库。项目已经成功完成 Prisma 7.x 迁移，并支持完整的用户认证和管理功能。

### ✨ 项目特性

- ✅ **NestJS 11.x** - 现代化企业级 Node.js 框架
- ✅ **Prisma ORM** - 类型安全的数据库访问
- ✅ **SQL Server** - 企业级数据库支持
- ✅ **JWT 认证** - 基于 JSON Web Token 的安全认证
- ✅ **密码哈希** - 使用 bcrypt 的安全密码存储
- ✅ **数据库事务** - 原子性操作保证
- ✅ **RESTful API** - 标准化的 API 设计
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **监听模式** - 开发时自动重启

---

## 🚀 快速开始

### 1. 环境配置

在项目根目录创建 `.env` 文件：

```env
# 数据库连接
DATABASE_URL="sqlserver://服务器名;database=数据库名;user=sa;password=密码;encrypt=true;trustServerCertificate=true"

# 应用配置
PORT=3000
JWT_SECRET=你的密钥(生产环境需要强密钥)
NODE_ENV=development
LOG_LEVEL=debug
```

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库迁移

```bash
npx prisma migrate deploy
```

### 4. 启动应用

```bash
npm run start:dev
```

应用将在 `http://localhost:3000` 启动

---

## 📁 项目结构

```
nest-jstest/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 根模块
│   ├── app.controller.ts       # 主控制器
│   ├── app.service.ts          # 主服务
│   │
│   ├── auth/                   # 认证模块
│   │   ├── auth.service.ts     # 认证逻辑
│   │   ├── auth.controller.ts  # 认证路由
│   │   ├── strategies/         # Passport 策略
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                  # 用户管理模块
│   │   ├── users.service.ts    # 用户业务逻辑
│   │   ├── users.controller.ts # 用户路由
│   │   ├── dto/                # 数据传输对象
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── users.module.ts
│   │
│   └── common/                 # 共享功能
│       ├── types.ts            # 类型定义
│       └── interceptors/       # 拦截器
│           └── logging.interceptor.ts
│
├── prisma/                     # Prisma 配置
│   ├── schema.prisma          # 数据库 Schema
│   └── migrations/            # 迁移历史
│
├── test/                      # 测试文件
├── .env                       # 环境变量
├── package.json              # 项目配置
├── tsconfig.json             # TypeScript 配置
├── nest-cli.json             # NestJS CLI 配置
└── README.md                 # 项目说明
```

---

## 🗄️ 数据库设计

### 数据模型

项目使用两个核心数据表：

#### 1. AuthCredential (认证凭据表)

存储用户登录凭据和认证信息。

| 字段           | 类型          | 说明              |
| -------------- | ------------- | ----------------- |
| userId         | UUID (PK)     | 用户ID (主键)     |
| loginName      | NVarChar(50)  | 登录用户名 (唯一) |
| passwordHash   | NVarChar(255) | 密码哈希值        |
| salt           | NVarChar(50)  | 密码盐值          |
| lastLoginIp    | NVarChar(45)? | 最后登录IP        |
| lastLoginTime  | DateTime?     | 最后登录时间      |
| loginFailCount | Int           | 登录失败次数      |
| isLocked       | Bit           | 是否锁定          |
| createdAt      | DateTime      | 创建时间          |

#### 2. UserProfile (用户资料表)

存储用户个人信息和资料。

| 字段      | 类型           | 说明                  |
| --------- | -------------- | --------------------- |
| userId    | UUID (PK, FK)  | 用户ID (主键/外键)    |
| fullName  | NVarChar(100)? | 完整名称              |
| email     | NVarChar(100)? | 邮箱                  |
| phone     | NVarChar(20)?  | 电话                  |
| avatarUrl | NVarChar(500)? | 头像URL               |
| status    | Int            | 状态 (1=正常, 2=禁用) |

### 关系图

```
AuthCredential (1:1) ←→ UserProfile
  - 一个认证凭据对应一个用户资料
  - 删除时级联删除关联的资料
```

---

## 🔌 API 接口

### 用户管理

#### 创建用户

**POST** `/users`

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "loginName": "user123",
    "password": "securepass123",
    "fullName": "张三",
    "email": "zhangsan@example.com",
    "phone": "+86 13800000000"
  }'
```

**响应**:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "张三",
  "email": "zhangsan@example.com",
  "phone": "+86 13800000000",
  "avatarUrl": null,
  "status": 1
}
```

#### 获取所有用户

**GET** `/users`

```bash
curl http://localhost:3000/users
```

#### 获取单个用户

**GET** `/users/:userId`

```bash
curl http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

#### 更新用户

**PATCH** `/users/:userId`

```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"fullName": "李四", "email": "lisi@example.com"}'
```

#### 删除用户

**DELETE** `/users/:userId`

```bash
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

### 认证

#### 用户登录

**POST** `/auth/login`

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginName": "user123", "password": "securepass123"}'
```

**响应**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_info": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "loginName": "user123"
  }
}
```

---

## 🔧 常见任务

### 执行数据库迁移

```bash
# 创建新迁移
npx prisma migrate dev --name your_migration_name

# 部署迁移
npx prisma migrate deploy

# 查看迁移状态
npx prisma migrate status

# 重置数据库 (仅开发环境!)
npx prisma migrate reset --force
```

### 查看数据库

使用 Prisma Studio 可视化查看数据库：

```bash
npx prisma studio
```

### 生成 Prisma Client

当修改 schema.prisma 后：

```bash
npx prisma generate
```

### 运行应用不同模式

```bash
# 开发模式 (带热重载)
npm run start:dev

# 调试模式
npm run start:debug

# 生产模式
npm run start:prod
```

### 代码格式化

```bash
npm run format
```

### 代码检查

```bash
npm run lint
```

### 运行测试

```bash
# 单元测试
npm run test

# 监听模式测试
npm run test:watch

# 覆盖率测试
npm run test:cov

# E2E 测试
npm run test:e2e
```

---

## 🐛 故障排查

### 问题: "Foreign key constraint violated"

**原因**: 尝试创建 UserProfile 而对应的 AuthCredential 不存在

**解决方案**:

- 确保先创建 AuthCredential 再创建 UserProfile
- 使用事务确保原子性:

```typescript
await this.prisma.$transaction(async (tx) => {
  await tx.authCredential.create({ data: {...} });
  await tx.userProfile.create({ data: {...} });
});
```

### 问题: "DATABASE_URL 未定义"

**原因**: .env 文件未配置

**解决方案**:

1. 创建 `.env` 文件在项目根目录
2. 设置 `DATABASE_URL` 环境变量
3. 重启应用

### 问题: Prisma Client 不同步

**原因**: schema 修改后未重新生成

**解决方案**:

```bash
npx prisma generate
npm run start:dev
```

### 问题: 端口已被占用

**解决方案**:

```bash
# 修改 .env 中的 PORT
PORT=3001
```

### 问题: 无法连接数据库

**检查清单**:

- ✓ SQL Server 是否运行
- ✓ 连接字符串是否正确
- ✓ 防火墙是否开放 1433 端口
- ✓ 用户名和密码是否正确
- ✓ 数据库是否存在

---

## 📦 依赖项

### 核心框架

- `@nestjs/core` - NestJS 核心
- `@nestjs/common` - NestJS 通用工具
- `@nestjs/platform-express` - Express 适配器

### 数据库

- `@prisma/client` - Prisma 客户端
- `prisma` - Prisma CLI

### 认证

- `@nestjs/jwt` - JWT 模块
- `@nestjs/passport` - Passport 集成
- `passport` - Passport 认证库
- `passport-jwt` - JWT 策略
- `passport-local` - 本地策略
- `bcrypt` - 密码哈希

### 其他

- `class-validator` - 数据验证
- `class-transformer` - 数据转换
- `nestjs-pino` - Pino 日志
- `pino` - 日志库

---

## 🎯 最佳实践

### 1. 密码安全

```typescript
// ✓ 正确: 使用 bcrypt 哈希
const salt = await bcrypt.genSalt();
const hash = await bcrypt.hash(password, salt);

// ✗ 错误: 明文存储
const hash = password; // 不要这样做!
```

### 2. 数据库事务

```typescript
// ✓ 正确: 使用事务
return this.prisma.$transaction(async (tx) => {
  await tx.authCredential.create({...});
  await tx.userProfile.create({...});
});

// ✗ 错误: 分开操作
await this.prisma.authCredential.create({...});
await this.prisma.userProfile.create({...}); // 可能失败!
```

### 3. 错误处理

```typescript
// ✓ 正确: 捕获和处理错误
try {
  await this.prisma.user.create({...});
} catch (error) {
  if (error.code === 'P2002') {
    throw new ConflictException('User already exists');
  }
  throw error;
}

// ✗ 错误: 忽略错误
await this.prisma.user.create({...});
```

### 4. DTO 验证

```typescript
// ✓ 正确: 使用装饰器验证
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  loginName: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// ✗ 错误: 手动验证
create(@Body() data) {
  if (!data.loginName) throw new Error();
}
```

---

## 📚 文档

完整的项目文档可在 `skills/` 目录中找到:

- **[nestjs-prisma-setup/SKILL.md](skills/nestjs-prisma-setup/SKILL.md)** - 项目设置指南
- **[DATABASE_SCHEMA.md](skills/nestjs-prisma-setup/references/DATABASE_SCHEMA.md)** - 数据库架构
- **[API_REFERENCE.md](skills/nestjs-prisma-setup/references/API_REFERENCE.md)** - API 参考
- **[ENV_VARIABLES.md](skills/nestjs-prisma-setup/references/ENV_VARIABLES.md)** - 环境变量配置
- **[DOCKER_SETUP.md](skills/nestjs-prisma-setup/references/DOCKER_SETUP.md)** - Docker 部署

---

## 🌐 外部资源

- [NestJS 官方文档](https://docs.nestjs.com)
- [Prisma 官方文档](https://www.prisma.io/docs)
- [SQL Server 连接字符串](https://www.connectionstrings.com/sql-server)
- [JWT 标准 RFC 7519](https://tools.ietf.org/html/rfc7519)

---

## 📝 许可证

MIT License

---

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目！

---

**最后更新**: 2026 年 4 月 27 日  
**项目版本**: 1.0.0  
**NestJS 版本**: 11.x  
**Prisma 版本**: 6.17.1+

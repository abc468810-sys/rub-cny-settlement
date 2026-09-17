# T07: 添加 .env.example

## 当前状态

项目没有 `.env.example` 文件。Prisma schema 引用了 `env("DATABASE_URL")`，但新开发者无法知道需要哪些环境变量。

## 任务目标

创建 `.env.example` 文件，列出所有必需的环境变量和示例值：

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/rub_cny_settlement"

# App (optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 不允许改动的范围

所有现有文件，仅创建新文件。

**唯一允许创建的文件**: `.env.example`

## 测试方法

```bash
# 1. 复制 .env.example 为 .env，填入真实数据库连接
# 2. npx prisma db push → 成功
# 3. npx prisma db seed → 成功
# 4. npm run dev → 应用启动
```

## 验收标准

- [ ] `.env.example` 存在于仓库根目录
- [ ] 包含 `DATABASE_URL` 和示例值
- [ ] 有注释说明每个变量的用途
- [ ] 不包含任何真实密码或密钥

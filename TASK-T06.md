# T06: 密码哈希校验

## 当前状态

认证系统完全无密码校验：

```typescript
// actions.ts - login 函数
export async function login(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // 用户不存在直接自动创建，无密码
    user = await prisma.user.create({ data: { email, ... } });
  }
  // 直接设置 session，从不检查 password
  await setSession(user.id);
  return { success: true, role: user.role };
}
```

User 模型有 `password` 字段（默认值 `"password123"`），但从未被读取或校验。

## 任务目标

实现基本的密码安全：

1. 安装 `bcryptjs` 依赖（轻量纯 JS 实现，无原生编译）
2. 修改 `login()` 函数：接收 password 参数，用 bcrypt.compare 校验
3. 修改 seed 数据：管理员和商户的密码用 bcrypt.hash 加密后写入
4. 登录页添加密码输入框（如已有则接入）

## 不允许改动的范围

| 文件/目录 | 原因 |
|-----------|------|
| `prisma/schema.prisma` | password 字段已存在，不需要改 |
| `src/lib/auth.ts` 中的 session 逻辑 | 保持 cookie 机制不变 |
| `src/app/**` 页面路由结构 | 登录页可加输入框但不改路由 |
| 业务逻辑（结算/审批等） | 不碰 |

**允许修改的文件**:
- `package.json`（添加 bcryptjs 依赖）
- `src/lib/actions.ts`（仅 login 函数）
- `src/app/login/page.tsx` 或对应组件（添加密码输入框）
- `prisma/seed.ts`（密码加密写入）

## 测试方法

```bash
# 1. 重新 seed
npx prisma db push --force-reset
npx prisma db seed

# 2. 启动
npm run dev

# 3. 正确密码登录 → 成功
# 4. 错误密码登录 → 失败，提示密码错误
# 5. 不存在的邮箱 → 提示用户不存在（不再自动创建）
```

## 验收标准

- [ ] bcryptjs 已安装
- [ ] login() 函数校验密码，密码错误返回明确错误
- [ ] 用户不存在时返回错误，不再自动创建
- [ ] seed 数据中密码为 bcrypt hash（非明文）
- [ ] 登录页有密码输入框
- [ ] 正确密码可登录，错误密码被拒绝

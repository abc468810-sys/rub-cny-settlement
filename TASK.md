# RU002 任务书

## 仓庘认定

- **GitHub 仓库**: `abc468810-sys/rub-cny-settlement`
- **项目名称**: CNY-RUB Cross-Border Settlement System (Demo Version)
- **技术栈**: Next.js 15.1.0 (App Router) + React 19 + TypeScript 5 + Prisma 5.22 (MySQL) + Tailwind CSS + Zustand + Framer Motion
- **默认分支**: `main`
- **最后提交**: 2026-04-12 (共 6 次提交，距约 5 个月未更新)

---

## 当前状态

### 已完成的功能

| 模块 | 状态 | 说明 |
|------|------|------|
| 用户认证 | ⚠️ 基础可用 | Cookie-based session，**无密码校验**，登录时用户不存在则自动创建 |
| 商户仪表盘 | ✅ 已实现 | `src/app/dashboard/` 下 7 个子路由（wallets / settlements / compliance / reports / matrix / developer / receipt） |
| 结算创建 | ✅ 已实现 | RUB → CNY 结算，1.5% 手续费，实时汇率（exchangerate-api.com，失败回退 12.87） |
| 管理员审批 | ✅ 已实现 | `/admin` 路由，可批准/拒绝结算、审批 KYC、管理系统配置 |
| 钱包管理 | ✅ 已实现 | CNY/RUB 双币种钱包，充值、余额扣减、结算入账 |
| 收款人管理 | ✅ 已实现 | Beneficiary CRUD |
| 系统配置 | ✅ 已实现 | SystemConfig 模型（品牌名、主题色、费率、路由路径、维护模式） |
| UI 组件 | ✅ 大量已实现 | 22 个 dashboard 组件 + 21 个 UI 组件（含图表、网络地图、热力图等可视化） |

### 存在的问题

1. **种子数据不完整**: `prisma/seed.ts` 只创建了 1 个商户 + 1 个 CNY 钱包，没有管理员账户、没有 RUB 钱包、没有任何示例交易记录 → **无法端到端测试结算流程**
2. **无测试套件**: 项目没有任何单元测试或集成测试（没有 jest/vitest 依赖）
3. **认证安全性为零**: `login()` 函数不校验密码，用户不存在直接自动注册
4. **README 与代码不一致**: README 提到 `src/services/settlement.ts`，实际该目录不存在，业务逻辑在 `src/lib/actions.ts`
5. **安全清理历史**: 提交记录中有 "security: clean malware dependencies"，说明曾被注入恶意依赖

---

## 建议任务：完善种子数据，支持完整结算流程的端到端验证

### 任务目标

修改 `prisma/seed.ts`，补充以下数据，使开发环境启动后可以直接走通完整的结算业务流程：

1. **管理员账户**: 1 个 `role=ADMIN` 的用户（如 `admin@tradebridge.cn`）
2. **商户 RUB 钱包**: 为现有商户补充 RUB 钱包并设置初始余额（如 500,000 RUB）
3. **示例结算交易**: 创建 3 笔不同状态的结算交易：
   - 1 笔 `PROCESSING`（待审批，可在 admin 页面看到）
   - 1 笔 `COMPLETED`（已完成的结算，CNY 钱包余额已入账）
   - 1 笔 `REJECTED`（被拒绝，RUB 已退回）
4. **示例收款人**: 为商户创建 2 个 Beneficiary 记录

### 不允许改动的范围（红线）

以下文件 **禁止修改**，只读不动：

| 文件/目录 | 原因 |
|-----------|------|
| `prisma/schema.prisma` | 数据模型不可变，避免迁移风险 |
| `src/lib/actions.ts` | 核心业务逻辑（结算、审批、充值等） |
| `src/lib/auth.ts` | 认证逻辑 |
| `src/app/**` | 所有页面文件 |
| `src/components/**` | 所有前端组件 |
| `src/lib/prisma.ts` | Prisma 客户端实例 |
| `src/lib/store.ts` | Zustand 状态管理 |
| `package.json` | 不新增/移除依赖 |
| `next.config.mjs` / `tsconfig.json` | 构建配置 |

**唯一允许修改的文件**: `prisma/seed.ts`

### 测试方法

```bash
# 1. 重置数据库并应用 schema
npx prisma db push --force-reset

# 2. 执行种子数据
npx prisma db seed

# 3. 启动开发服务器
npm run dev

# 4. 浏览器验证流程
#    a. 用 admin@tradebridge.cn 登录 → 访问 /admin → 应看到 1 笔 PROCESSING 交易
#    b. 退出，用 merchant@example.com 登录 → 访问 /dashboard/wallets → 应看到 CNY + RUB 双钱包余额
#    c. 访问 /dashboard/settlements → 用 RUB 余额发起一笔新结算
#    d. 切回 admin → 审批该结算 → 回到商户仪表盘确认 CNY 余额已增加
#    e. 检查交易历史，应有 PROCESSING + COMPLETED + REJECTED 三种状态记录
```

### 验收标准

- [ ] `npx prisma db seed` 执行无报错
- [ ] 数据库中存在 1 个 ADMIN 用户 + 1 个 MERCHANT 用户
- [ ] 商户同时拥有 CNY 钱包（有余额）和 RUB 钱包（有余额 ≥ 100,000）
- [ ] 存在 3 笔结算交易，状态分别为 PROCESSING / COMPLETED / REJECTED 各 1 笔
- [ ] PROCESSING 交易出现在 `/admin` 页面的待审批列表中
- [ ] COMPLETED 交易的 targetAmount 已反映在商户 CNY 钱包余额中
- [ ] REJECTED 交易的 amount 已退回商户 RUB 钱包余额中
- [ ] 存在 2 个 Beneficiary 记录，归属商户用户
- [ ] 不引入任何新的 npm 依赖
- [ ] 不修改 schema.prisma 及上述红线范围内的任何文件

---

## 后续候选任务（本次不实施，仅记录）

1. 提取结算计算逻辑为纯函数 + 添加 vitest 单元测试
2. 实现密码哈希校验（替换当前的"无密码"登录）
3. 修正 README 中的文件路径引用（`src/services/` → `src/lib/`）
4. 为结算表单添加输入校验（金额 > 0、银行账号非空等）

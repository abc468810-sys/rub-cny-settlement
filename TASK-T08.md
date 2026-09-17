# T08: Admin 统计接真数据

## 当前状态

`src/app/admin/page.tsx` 顶部有 3 个统计卡片，数据完全硬编码：

```tsx
const stats = [
  { label: 'Daily Flow (RUB)', value: '₽ 45.2M', trend: '+12.4%', icon: ... },
  { label: 'CNY Liquidity', value: '¥ 12.8M', trend: 'Optimal', icon: ... },
  { label: 'Network Shards', value: '14 Active', trend: 'Sync 100%', icon: ... },
];
```

这些数字不反映任何真实数据。

## 任务目标

将 3 个统计卡片替换为从数据库查询的真实数据：

1. **Daily Flow (RUB)**: 查询当天所有 `type=SETTLEMENT` 且 `fromCurrency=RUB` 的交易 amount 总和
2. **CNY Liquidity**: 查询所有 CNY 钱包的 balance 总和
3. **Network Shards**: 可以保留为展示性数据（如查询系统配置中的 routingPath），或改为"Active Users"（查询 MERCHANT 用户数）

在 `src/lib/actions.ts` 中添加一个新的 server action `getAdminStats()` 返回这些数据，然后在 admin page 中调用。

## 不允许改动的范围

| 文件/目录 | 原因 |
|-----------|------|
| `prisma/schema.prisma` | 数据模型不变 |
| `src/lib/auth.ts` | 认证不变 |
| `src/app/**` 其他页面 | 只改 admin |
| `src/components/**` | 组件不变 |
| `package.json` | 不新增依赖 |

**允许修改的文件**:
- `src/lib/actions.ts`（新增 `getAdminStats` 函数，不改现有函数）
- `src/app/admin/page.tsx`（替换硬编码 stats 为真实数据）

## 测试方法

```bash
npx prisma db push --force-reset && npx prisma db seed
npm run dev

# 1. 用 admin 账户登录 → 访问 /admin
# 2. 统计卡片显示真实数据（非 45.2M / 12.8M / 14）
# 3. 创建新结算 → 刷新 admin → Daily Flow 数字变化
```

## 验收标准

- [ ] 3 个统计卡片的数据来自数据库查询
- [ ] `getAdminStats` 需要 admin 权限（调用 `requireAdmin`）
- [ ] Daily Flow 反映当天真实结算总额
- [ ] CNY Liquidity 反映所有 CNY 钱包余额总和
- [ ] 新增函数不修改现有 actions 中的任何函数
- [ ] 不新增 npm 依赖

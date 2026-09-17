# T02: 删除遗留 Zustand Store

## 当前状态

`src/lib/store.ts` 是项目早期原型的客户端状态管理，存在以下问题：
- 结算方向与实际业务相反（store 做 CNY→RUB，实际 actions 做 RUB→CNY）
- 硬编码初始余额（cnyBalance: 452310.89, rubBalance: 5820120.50），与 seed 数据不同步
- 包含本地 addSettlement/approveSettlement/rejectSettlement 方法，与 server actions 重复
- 经过代码审查，DashboardClient 和所有页面组件已不引用此 store，实际数据全部来自 server actions

## 任务目标

删除 `src/lib/store.ts` 文件，并确认无任何组件引用它。

## 不允许改动的范围

| 文件/目录 | 原因 |
|-----------|------|
| `src/lib/actions.ts` | 业务逻辑 |
| `src/lib/auth.ts` | 认证逻辑 |
| `src/app/**` | 页面文件 |
| `prisma/schema.prisma` | 数据模型 |
| `package.json` | 不移除 zustand 依赖（可能有其他用途，后续单独评估） |

**唯一允许修改的文件**: `src/lib/store.ts`（删除）

## 测试方法

```bash
# 1. 全局搜索确认无引用
grep -r "store" src/ --include="*.tsx" --include="*.ts" | grep "from.*store"

# 2. 构建验证
npm run build

# 3. 启动开发服务器，手动测试
npm run dev
# 访问 /dashboard 和 /dashboard/settlements，确认页面正常加载
```

## 验收标准

- [ ] `src/lib/store.ts` 已删除
- [ ] 全局搜索无任何文件引用 `@/lib/store` 或 `useStore`
- [ ] `npm run build` 无报错
- [ ] 仪表盘页面正常加载，数据来自 server actions

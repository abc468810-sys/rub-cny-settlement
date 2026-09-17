# T04: 服务端输入校验

## 当前状态

`src/lib/actions.ts` 的 `createSettlement` 函数直接接收 4 个参数，无任何校验：

```typescript
export async function createSettlement(
  amount: number,
  bankAccount: string,
  contractNo: string,
  commodityType: string
) {
  // 直接进入数据库操作，无校验
  const session = await requireAuth();
  // ...
}
```

潜在风险：
- `amount` 可以是 0、负数、NaN
- `bankAccount` 可以是空字符串
- `contractNo` / `commodityType` 可以是空字符串
- 无金额上限检查（前端有 RUB 余额判断，但服务端没有）
- 无并发控制（同一用户可同时发起多笔结算，可能导致余额透支）

## 任务目标

在 `createSettlement` 函数开头添加输入校验，**只添加校验逻辑，不修改现有业务计算和数据库操作**：

1. `amount` > 0 且为有效数字
2. `bankAccount` 非空，长度 >= 6
3. `contractNo` 非空
4. `commodityType` 非空
5. 校验失败时抛出明确的 Error（包含字段名和原因），前端已有 catch 逻辑可展示

## 不允许改动的范围

| 文件/目录 | 原因 |
|-----------|------|
| `prisma/**` | 数据层 |
| `src/lib/auth.ts` | 认证 |
| `src/app/**` | 页面 |
| `src/components/**` | 组件 |
| `package.json` | 不新增依赖 |
| `createSettlement` 中的业务计算逻辑 | 只加校验，不改计算 |

**唯一允许修改的文件**: `src/lib/actions.ts`（仅 `createSettlement` 函数的前置校验部分）

## 测试方法

```bash
npm run dev

# 1. 正常提交 → 成功（回归测试）
# 2. amount = 0 → 报错 "Invalid amount"
# 3. amount = -100 → 报错
# 4. bankAccount = "" → 报错 "Bank account required"
# 5. bankAccount = "123" → 报错 "Bank account too short"
# 6. contractNo = "" → 报错
# 7. commodityType = "" → 报错
```

## 验收标准

- [ ] amount <= 0 或 NaN 时抛错
- [ ] bankAccount 为空或长度 < 6 时抛错
- [ ] contractNo 为空时抛错
- [ ] commodityType 为空时抛错
- [ ] 错误信息包含具体字段名，前端 NotificationProvider 能展示
- [ ] 正常输入不受影响（回归通过）
- [ ] 不修改业务计算逻辑和数据库操作

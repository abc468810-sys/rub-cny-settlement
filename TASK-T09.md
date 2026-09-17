# T09: 结算计算单元测试

## 当前状态

项目零测试覆盖。结算计算逻辑（手续费、汇率换算、到账金额）直接嵌入在 `createSettlement` server action 中，无法单独测试：

```typescript
// actions.ts - createSettlement 中的计算部分
const baseRate = await getLatestRate(); // CNY to RUB
const rate = 1 / baseRate;              // RUB to CNY
const fee = amount * 0.015;
const netAmount = amount - fee;
const targetAmount = netAmount * rate;
```

## 任务目标

1. 安装 `vitest` 作为 dev dependency
2. 创建 `src/lib/settlement.ts`，将计算逻辑提取为纯函数：

```typescript
// 示例结构
export const FEE_RATE = 0.015;
export const PRIORITY_FEE_RATE = 0.020;
export const FALLBACK_RATE = 12.87;

export function calculateFee(amount: number, isPriority = false): number
export function calculateNetAmount(amount: number, fee: number): number
export function calculateTargetAmount(netAmount: number, cnyToRubRate: number): number
export function calculateSettlement(amount: number, cnyToRubRate: number, isPriority = false): {
  fee: number; netAmount: number; targetAmount: number; rate: number;
}
```

3. 在 `actions.ts` 的 `createSettlement` 中调用这些纯函数（最小改动）
4. 创建 `src/lib/__tests__/settlement.test.ts`，覆盖正常值、零、负数、大额、优先费率等场景

## 不允许改动的范围

| 文件/目录 | 原因 |
|-----------|------|
| `prisma/**` | 数据层 |
| `src/lib/auth.ts` | 认证 |
| `src/app/**` | 页面 |
| `src/components/**` | 组件 |
| `createSettlement` 中的数据库操作逻辑 | 只替换计算部分 |

**允许修改/创建的文件**:
- `package.json`（添加 vitest）
- `src/lib/settlement.ts`（新建）
- `src/lib/__tests__/settlement.test.ts`（新建）
- `src/lib/actions.ts`（仅 `createSettlement` 中的计算部分改用纯函数）
- `vitest.config.ts`（新建，如需要）

## 测试方法

```bash
npx vitest run
```

## 验收标准

- [ ] `src/lib/settlement.ts` 包含 4 个纯函数
- [ ] `createSettlement` 调用纯函数，行为不变（回归通过）
- [ ] 测试覆盖正常值（1000 RUB）、零、负数、大额（10,000,000）、优先费率
- [ ] 所有测试通过
- [ ] `npm run build` 无报错

# T03: 修复结算表单多步流程

## 当前状态

`src/components/ui/SettlementClientForm.tsx` 定义了 4 个步骤的结算流程，但只有 `step === 'input'` 有完整实现，其余 3 步（`security_check` / `risk_intercept` / `review`）只渲染了一个 "Vetting..." 占位 div：

```tsx
// 当前代码 - step !== 'input' 时
<div className="py-20 text-center text-gray-300 uppercase font-black text-xs">Vetting...</div>
```

表单的逻辑分支已写好：
- 金额 >= 5,000,000 → `risk_intercept`（需风险拦截）
- 金额 >= 1,000,000 → `security_check`（需 OTP 验证，硬编码 `123456`）
- 其他 → 直接 `review`（确认提交）

`handleConfirm` 已调用 `createSettlement` server action，但多步 UI 未实现。

## 任务目标

补全 `security_check`、`risk_intercept`、`review` 三个步骤的 UI 和交互：

1. **security_check**: OTP 输入框，用户输入验证码（当前硬编码 `123456`，保留即可），验证通过后进入 review
2. **risk_intercept**: 风险提示页，显示金额超过 500 万的警告，提供"继续"和"取消"按钮
3. **review**: 最终确认页，显示汇总信息（金额、手续费、到账金额、收款账户、合同号、商品编码），点击确认后执行已有的 vetting 动画 + `createSettlement` 调用

## 不允许改动的范围

| 文件/目录 | 原因 |
|-----------|------|
| `src/lib/actions.ts` | 业务逻辑不变 |
| `src/lib/auth.ts` | 认证逻辑 |
| `prisma/**` | 数据层 |
| `src/app/**` | 页面路由 |
| `package.json` | 不新增依赖 |
| 其他所有组件 | 只动这一个文件 |

**唯一允许修改的文件**: `src/components/ui/SettlementClientForm.tsx`

## 测试方法

```bash
npm run dev

# 1. 普通金额 (< 100万): 填表 → 直接进入 review → 确认 → 跳转 dashboard
# 2. 中等金额 (100万-500万): 填表 → security_check → 输入 123456 → review → 确认
# 3. 大额 (>= 500万): 填表 → risk_intercept → 继续 → security_check → review → 确认
# 4. 取消按钮: 任何步骤点取消 → 回到 input 步骤
```

## 验收标准

- [ ] 三种金额区间分别触发正确的步骤流程
- [ ] security_check 步骤有 OTP 输入框，验证逻辑正常
- [ ] risk_intercept 步骤有风险警告和继续/取消按钮
- [ ] review 步骤显示完整汇总信息
- [ ] 确认提交后 vetting 动画正常播放，调用 `createSettlement` 成功
- [ ] 所有取消操作正确回退到 input 步骤
- [ ] 不新增 npm 依赖，不修改其他文件

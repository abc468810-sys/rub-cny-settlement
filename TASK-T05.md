# T05: 修正 README 文件路径

## 当前状态

README.md 中引用了不存在的文件路径和目录：

```
## 🛠️ Project Structure
- `src/app/dashboard`: Main dashboard and wallet views.
- `src/app/dashboard/settlements`: Settlement request form and history.
- `src/services/settlement.ts`: Core business logic for settlement calculation.  ← 不存在
- `prisma/schema.prisma`: Data models for Users, Wallets, and Transactions.
```

实际业务逻辑在 `src/lib/actions.ts`，不存在 `src/services/` 目录。

## 任务目标

更新 README.md 的 Project Structure 部分，使其与实际代码结构一致：

1. `src/services/settlement.ts` → `src/lib/actions.ts`
2. 补充 `src/lib/` 下其他文件（auth.ts, prisma.ts, store.ts, utils.ts, dictionaries.ts）
3. 补充 `src/components/` 目录结构概述
4. 更新 Quick Start 中的命令说明（如有需要）

## 不允许改动的范围

所有代码文件，仅修改 `README.md`。

**唯一允许修改的文件**: `README.md`

## 测试方法

```bash
# 1. 检查 README 中引用的所有路径在仓库中存在
# 2. npm run dev 确认应用正常启动（README 不影响运行，但做一次冒烟测试）
```

## 验收标准

- [ ] README 中不引用任何不存在的文件路径
- [ ] Project Structure 准确反映 `src/lib/`、`src/app/`、`src/components/`、`prisma/` 的实际结构
- [ ] 业务规则和 Quick Start 部分不变

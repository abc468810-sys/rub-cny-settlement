# RU002 任务看板

> 更新时间: 2026-09-17 14:15
> 仓库: abc468810-sys/rub-cny-settlement

## 任务总览

| ID | 任务 | 优先级 | 改动文件 | 状态 |
|----|------|--------|----------|------|
| T01 | 完善种子数据 | P0-地基 | `prisma/seed.ts` | 待确认 |
| T02 | 删除遗留 Zustand store | P0-清理 | `src/lib/store.ts` | 待确认 |
| T03 | 修复结算表单多步流程 | P1-核心 | `src/components/ui/SettlementClientForm.tsx` | 待确认 |
| T04 | 服务端输入校验 | P1-核心 | `src/lib/actions.ts` | 待确认 |
| T05 | 修正 README 文件路径 | P1-文档 | `README.md` | 待确认 |
| T06 | 密码哈希校验 | P2-安全 | `src/lib/auth.ts` + `src/lib/actions.ts` + `prisma/seed.ts` | 待确认 |
| T07 | 添加 .env.example | P2-配置 | `.env.example` (新建) | 待确认 |
| T08 | Admin 统计接真数据 | P3-增强 | `src/app/admin/page.tsx` | 待确认 |
| T09 | 结算计算单元测试 | P3-增强 | 新建 `src/lib/__tests__/` + `package.json` | 待确认 |

## 依赖关系

```
T01 (种子数据) ── 无依赖, 可立即开始
T02 (删 store) ── 无依赖, 可立即开始
T03 (表单修复) ── 无依赖, 可立即开始
T04 (输入校验) ── 无依赖, 可立即开始
T05 (README)   ── 无依赖, 可立即开始
T06 (密码)     ── 建议在 T01 之后 (seed 需同步改)
T07 (.env)     ── 无依赖, 可立即开始
T08 (Admin统计) ── 建议在 T01 之后 (需要种子数据验证)
T09 (单元测试) ── 无依赖, 可立即开始
```

## 并行批次建议

- **第一批 (可立即并行)**: T01, T02, T03, T04, T05, T07, T09
- **第二批 (依赖 T01)**: T06, T08

详细任务定义见各 Task 文件:
- `TASK.md` = T01 详细定义
- `TASK-T02.md` ~ `TASK-T09.md` = T02~T09 详细定义

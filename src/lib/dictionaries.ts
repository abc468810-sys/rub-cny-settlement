type Dictionary = {
  portfolio: string;
  settlement: string;
  wallets: string;
  new_request: string;
  payout_proceeds: string;
  compliance_onboarding: string;
  kyc_required: string;
  approve: string;
  reject: string;
  reports: string;
  statements: string;
  generate_report: string;
  tax_summary: string;
  developer: string;
  api_keys: string;
  generate_key: string;
  sandbox: string;
  trade_remittance: string;
  exclusive_notice: string;
};

const zh: Dictionary = {
  portfolio: "贸易看板",
  settlement: "贸易结算",
  wallets: "卢布储备",
  new_request: "+ 发起贸易汇款",
  payout_proceeds: "预计人民币到账",
  compliance_onboarding: "贸易企业入驻",
  kyc_required: "需要完成贸易资质验证",
  approve: "核准放款",
  reject: "拒绝并退回卢布",
  reports: "对账报告",
  statements: "贸易账单",
  generate_report: "生成审计报告",
  tax_summary: "税务概览",
  developer: "接口中心",
  api_keys: "API 密钥",
  generate_key: "生成密钥",
  sandbox: "沙盒",
  trade_remittance: "仅限贸易项下卢布回款",
  exclusive_notice: "本平台仅支持中俄贸易项下卢布换人民币结算，不接受任何非贸易项目。",
};

const ru: Dictionary = {
  portfolio: "Торговый портфель",
  settlement: "Торговые расчеты",
  wallets: "Резервы RUB",
  new_request: "+ Новый торговый перевод",
  payout_proceeds: "Выплата в CNY",
  compliance_onboarding: "Регистрация компании",
  kyc_required: "Требуется верификация торговой компании",
  approve: "Одобрить",
  reject: "Отклонить",
  reports: "Отчеты",
  statements: "Выписки",
  generate_report: "Создать отчет",
  tax_summary: "Налоги",
  developer: "API",
  api_keys: "Ключи",
  generate_key: "Создать",
  sandbox: "Песочница",
  trade_remittance: "Только торговые переводы RUB-CNY",
  exclusive_notice: "Платформа поддерживает только торговые расчеты. Прочие проекты не принимаются.",
};

const en: Dictionary = {
  portfolio: "Trade Portfolio",
  settlement: "Trade Settlement",
  wallets: "RUB Reserves",
  new_request: "+ New Trade Remittance",
  payout_proceeds: "CNY Proceeds",
  compliance_onboarding: "Enterprise Onboarding",
  kyc_required: "Trade Verification Required",
  approve: "Approve Release",
  reject: "Reject & Refund",
  reports: "Reports",
  statements: "Statements",
  generate_report: "Generate Audit Report",
  tax_summary: "Tax Summary",
  developer: "Developer",
  api_keys: "API Keys",
  generate_key: "Generate Key",
  sandbox: "Sandbox",
  trade_remittance: "Exclusive RUB-CNY Trade Remittance",
  exclusive_notice: "This platform is exclusively for RUB to CNY trade remittance. No other services provided.",
};

const dictionaries = { zh, ru, en };

export function getDictionary(lang: string = 'en') {
  return dictionaries[lang as keyof typeof dictionaries] || en;
}
